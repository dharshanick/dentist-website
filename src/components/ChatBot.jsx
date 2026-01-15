import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi there! How can I help you?", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- 🧠 THE BRAIN: NEW INTELLIGENT LOGIC ---
    const getBotResponse = (text) => {
        const lowerText = text.toLowerCase();

        // 1. TRACKING / CHECK STATUS (Your Request)
        if (lowerText.includes("track") || lowerText.includes("check") || lowerText.includes("status") || lowerText.includes("where is my")) {
            return "📍 **How to Check Your Appointment:**\n\n1. Look at the top right of the screen.\n2. Click the **'Track Booking'** button.\n3. Enter the **Phone Number** you used to book.\n\nThe system will show if you are Confirmed or Pending!";
        }

        // 2. CANCELLATION REASONS (Your Request)
        if (lowerText.includes("cancel") || lowerText.includes("why") && lowerText.includes("delete")) {
            return "❓ **Why was my appointment cancelled?**\n\nUsually, appointments are cancelled if:\n1. The doctor is unavailable for an emergency.\n2. The slot was double-booked.\n3. Incorrect contact details were provided.\n\nPlease reschedule or check the 'Track Booking' tab for details.";
        }

        // 3. DOCTOR INFO / EXPERIENCE (Your Request)
        if (lowerText.includes("doctor") || lowerText.includes("experience") || lowerText.includes("who") || lowerText.includes("good")) {
            return "👨⚕️ **About Dr. Smith:**\n\nHe is our Senior Specialist with **over 5 years of experience**.\n\n🌟 **Reputation:** Rated 4.9/5 by 500+ happy patients.\n🏆 **Specialty:** Known for 'Painless Dentistry' and Root Canals.";
        }

        // 4. COSTS (Keeping the Indian Prices)
        if (lowerText.includes("surgery") && (lowerText.includes("cost") || lowerText.includes("price"))) {
            return "🏥 **Surgery Costs:**\nComplex surgeries generally start from **₹50,000**. This varies based on the complication level.";
        }
        if (lowerText.includes("root canal") || lowerText.includes("rct")) {
            return "🦷 **Root Canal (RCT):**\nPrices range from **₹5,000 to ₹12,000** depending on the cap selected.";
        }
        if (lowerText.includes("clean") || lowerText.includes("scaling")) {
            return "✨ **Teeth Cleaning:**\nStandard scaling is **₹1,500 - ₹3,000**.";
        }

        // 5. LOCATION & TIMINGS (Extra Info)
        if (lowerText.includes("location") || lowerText.includes("where") || lowerText.includes("address")) {
            return "📍 **We are located at:**\n123 Health Street, Tech City, India.\n(Near the Central Mall)";
        }
        if (lowerText.includes("time") || lowerText.includes("open") || lowerText.includes("hours")) {
            return "⏰ **Clinic Timings:**\nMon - Sat: 10:00 AM - 8:00 PM\nSunday: Closed";
        }

        // 6. DEFAULT ANSWER
        return "I'm still learning! Try asking: 'How do I track my booking?', 'Who is the doctor?', or 'Surgery cost'.";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");

        setTimeout(() => {
            const response = getBotResponse(input);
            setMessages(prev => [...prev, { text: response, sender: "bot" }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4 pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="bg-teal-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-1.5 rounded-full"><Bot size={18} /></div>
                                <span className="font-bold">SmartDent Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition"><X size={18} /></button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'bot' && <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 text-teal-700"><Bot size={12} /></div>}
                                    <div className={`max-w-[80%] p-3 text-sm rounded-2xl ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm whitespace-pre-line'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
                            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 bg-gray-50 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            <button type="submit" className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 transition"><Send size={18} /></button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ICON ONLY BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg shadow-teal-600/30 transition-transform hover:scale-110 flex items-center justify-center"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

        </div>
    );
};

export default ChatBot;
