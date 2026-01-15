const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const bodyParser = require('body-parser'); // Removed to avoid missing dependency
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Keeping this just in case, though user code didn't have it explicitly, it's good practice.

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Replaced bodyParser.json() with express.json()

// --- MONGODB CONNECTION ---
// Use the secret cloud link OR fallback to localhost
const dbLink = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartdent';

mongoose.connect(dbLink)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// --- SCHEMA DEFINITION ---
const appointmentSchema = new mongoose.Schema({
    service: String,
    problemType: String,
    description: String,
    date: String,
    timeSlot: String,
    name: String,
    email: String,
    phone: String,
    age: String,
    status: { type: String, default: 'Pending' }, // Pending, Confirmed, Cancelled

    // New Features
    confirmedAt: { type: Date },      // For the 5-Hour Rule
    isDeleted: { type: Boolean, default: false }, // Soft Delete
    meetingLink: { type: String, default: "" },   // Video Call Link

    createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dharshanick02@gmail.com', // <--- REAL GMAIL (Restored)
        pass: 'yhqi fqis drpt whfv'        // <--- REAL APP PASSWORD (Restored)
    }
});

// --- ROUTES ---

// 1. GET ALL APPOINTMENTS (Only shows non-deleted ones)
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ isDeleted: false }).sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Fetch failed" });
    }
});

// 2. CREATE NEW APPOINTMENT
app.post('/api/appointments', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: "Booking failed" });
    }
});

// 3. SEARCH / TRACKING (By Phone Number)
app.get('/api/appointments/search/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        const myAppointments = await Appointment.find({
            phone: phone,
            isDeleted: false
        }).sort({ createdAt: -1 });
        res.json(myAppointments);
    } catch (error) {
        res.status(500).json({ error: "Search failed" });
    }
});

// 4. UPDATE STATUS (With Video Link & Timestamp Logic)
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { status } = req.body;
        let updateData = { status };

        // If Confirming, add Time and Video Link
        if (status === 'Confirmed') {
            updateData.confirmedAt = new Date();
            updateData.meetingLink = `https://meet.jit.si/SmartDent-${req.params.id}`;
        }

        const updatedAppt = await Appointment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        // Send Email (Optional - Wrapped in try/catch so it doesn't crash server if email fails)
        if (status === 'Confirmed' && updatedAppt.email) {
            try {
                await transporter.sendMail({
                    from: 'SmartDent Clinic',
                    to: updatedAppt.email,
                    subject: 'Appointment Confirmed! 🦷',
                    text: `Your appointment is confirmed for ${updatedAppt.date} at ${updatedAppt.timeSlot}. \n\nJoin Video Call: ${updateData.meetingLink}`
                });
            } catch (emailErr) {
                console.log("⚠️ Email failed to send (but booking saved):", emailErr.message);
            }
        }

        res.json(updatedAppt);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Update failed" });
    }
});

// 5. DELETE (Soft Delete)
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { isDeleted: true });
        res.json({ message: "Archived (Soft Deleted)" });
    } catch (error) {
        res.status(500).json({ error: "Delete failed" });
    }
});

// 🤖 DR. AI CHATBOT ROUTE
app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Connect to Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // 2. Define the "Personality"
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "You are Dr. AI, the virtual assistant for SmartDent Clinic. Your job is to answer patient questions about teeth, appointments, and dental care politely. Keep answers short (under 50 words). If someone asks non-dental questions, say 'I can only help with dental queries.'" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Dr. AI, ready to assist your patients." }],
                },
            ],
        });

        // 3. Send the message and get response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // 4. Send back to Frontend
        res.json({ reply: text });

    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Dr. AI is currently offline." });
    }
});

// --- START SERVER ---
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
