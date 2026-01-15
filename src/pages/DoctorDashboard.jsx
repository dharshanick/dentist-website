import { Calendar, CheckCircle, Clock, XCircle, Users, Settings, Search, Sparkles, LogOut, Trash2, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('appointments');

    // --- STATE ---
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // AI Tool State
    const [aiInput, setAiInput] = useState("");
    const [aiResponse, setAiResponse] = useState(null); // Stores the filtered list from AI

    const [settings, setSettings] = useState({
        clinicName: "SmartDent Clinic",
        doctorName: "Dr. Smith",
        availability: true
    });

    // --- 1. FETCH DATA ---
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch('https://dentist-website-qrk4.onrender.com/api/appointments');
            const data = await res.json();
            setAppointments(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    // --- 2. ACTIONS ---
    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`https://dentist-website-qrk4.onrender.com/api/appointments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            // Update UI locally
            setAppointments(appointments.map(appt =>
                appt._id === id ? { ...appt, status: newStatus } : appt
            ));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const deleteAppointment = async (id) => {
        if (!window.confirm("Are you sure you want to delete this permanently?")) return;
        try {
            await fetch(`https://dentist-website-qrk4.onrender.com/api/appointments/${id}`, { method: 'DELETE' });
            setAppointments(appointments.filter(appt => appt._id !== id));
        } catch (error) {
            alert("Failed to delete");
        }
    };

    // --- 3. AI LOGIC (The Brain) ---
    const handleAIQuery = () => {
        if (!aiInput.trim()) return;
        setLoading(true);

        setTimeout(() => {
            const query = aiInput.toLowerCase();
            let results = [];
            let message = "";

            // Logic: Search for Date Matches (e.g., "15", "dec", "2026")
            // We look through all CONFIRMED appointments
            results = appointments.filter(appt => {
                const dateStr = appt.date.toLowerCase(); // e.g., "2026-01-15"
                // Simple check: does the appointment date contain the user's search numbers?
                // Note: This is a basic match. In a real AI, we'd parse dates strictly.
                return (dateStr.includes(query) || appt.date.includes(aiInput)) && appt.status === 'Confirmed';
            });

            if (results.length > 0) {
                message = `I found ${results.length} confirmed patient(s) matching "${aiInput}":`;
            } else {
                message = `No confirmed patients found for "${aiInput}". Try a format like "2026-01-15".`;
            }

            setAiResponse({ message, data: results });
            setLoading(false);
        }, 1000); // Fake "Thinking" delay
    };

    const handleLogout = () => navigate('/');

    // --- VIEWS ---

    // VIEW 1: APPOINTMENTS
    const renderAppointments = () => (
        <div className="bg-white rounded-3xl shadow-sm border border-teal-100 overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-teal-50 flex justify-between items-center bg-teal-50/50">
                <h3 className="font-bold text-lg text-teal-900">Today's Schedule</h3>
                <span className="text-xs font-bold bg-white text-teal-600 border border-teal-100 px-3 py-1 rounded-full">
                    {appointments.length} Total
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-teal-50/50 uppercase text-xs font-bold text-teal-500">
                        <tr>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Patient</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-50">
                        {appointments.map((appt) => (
                            <tr key={appt._id} className="hover:bg-teal-50/40 transition">
                                <td className="p-4">
                                    <div className="font-bold text-teal-900">{appt.date}</div>
                                    <div className="text-xs text-teal-600">{appt.timeSlot}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-900">{appt.name}</div>
                                    <div className="text-xs text-gray-400">{appt.phone}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${appt.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                        appt.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2 justify-end">
                                    {/* --- NEW: VIDEO CALL BUTTON FOR DOCTOR --- */}
                                    {appt.status === 'Confirmed' && appt.meetingLink && (
                                        <a
                                            href={appt.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title="Start Online Meeting"
                                            className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                                        >
                                            {/* Video Camera Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                        </a>
                                    )}

                                    <button onClick={() => updateStatus(appt._id, 'Confirmed')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg" title="Confirm"><CheckCircle size={18} /></button>
                                    <button onClick={() => updateStatus(appt._id, 'Cancelled')} className="p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg" title="Cancel"><XCircle size={18} /></button>
                                    <button onClick={() => deleteAppointment(appt._id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg" title="Delete"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    // VIEW 2: PATIENTS DATABASE + AI TOOL
    const renderPatients = () => {
        // Default: Show ONLY Confirmed Patients if no AI query active
        const displayList = aiResponse ? aiResponse.data : appointments.filter(a => a.status === 'Confirmed');

        return (
            <div className="space-y-6">
                {/* --- AI COMMAND BAR --- */}
                <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            <Sparkles className="text-yellow-300 animate-pulse" /> Dr. AI Analytics
                        </h3>
                        <p className="text-teal-100 mb-6 max-w-lg">
                            Ask me anything about your records. Try: <span className="bg-white/20 px-2 rounded text-xs">"2026-01-15"</span> or <span className="bg-white/20 px-2 rounded text-xs">"Cleaning"</span>
                        </p>

                        <div className="flex gap-2 max-w-md bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
                            <input
                                type="text"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
                                placeholder="Type a date (e.g., 2026-01-14)..."
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-teal-200/70 px-4"
                            />
                            <button
                                onClick={handleAIQuery}
                                className="bg-white text-teal-700 p-3 rounded-xl hover:bg-teal-50 transition-transform hover:scale-105 font-bold"
                            >
                                <Send size={18} />
                            </button>
                        </div>

                        {/* AI RESPONSE MESSAGE */}
                        {aiResponse && (
                            <div className="mt-4 bg-black/20 inline-block px-4 py-2 rounded-lg text-sm border border-white/10 animate-fade-in">
                                🤖 {aiResponse.message}
                            </div>
                        )}
                    </div>

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full blur-[100px] opacity-20"></div>
                </div>

                {/* --- PATIENT LIST --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-teal-100 overflow-hidden">
                    <div className="p-6 border-b border-teal-50 bg-teal-50/30">
                        <h3 className="font-bold text-teal-900">
                            {aiResponse ? "AI Search Results" : "All Confirmed Patients"}
                        </h3>
                    </div>

                    {displayList.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            No records found.
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-400">
                                <tr>
                                    <th className="p-4">Details</th>
                                    <th className="p-4">Condition</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Contact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {displayList.map((pt) => (
                                    <tr key={pt._id} className="hover:bg-teal-50/20">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{pt.name}</div>
                                            <div className="text-xs text-gray-400">Age: {pt.age}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-xs font-bold">{pt.service}</span>
                                        </td>
                                        <td className="p-4 font-mono text-xs">
                                            {pt.date} <br /> {pt.timeSlot}
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            📞 {pt.phone} <br /> 📧 {pt.email || "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Reset Button (Only shows if searching) */}
                {aiResponse && (
                    <div className="text-center">
                        <button onClick={() => { setAiResponse(null); setAiInput(""); }} className="text-teal-600 font-bold hover:underline">
                            Show All Patients
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-teal-50/30 flex font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-teal-900 text-white p-6 hidden md:flex flex-col justify-between fixed h-full z-10 shadow-2xl">
                <div>
                    <h2 className="text-2xl font-bold mb-10 text-white flex items-center gap-2"><span className="text-3xl">🦷</span> SmartDent</h2>
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab('appointments')} className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${activeTab === 'appointments' ? 'bg-teal-600 text-white shadow-lg' : 'text-teal-100 hover:bg-teal-800'}`}>
                            <Calendar size={20} /> Appointments
                        </button>
                        <button onClick={() => setActiveTab('patients')} className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${activeTab === 'patients' ? 'bg-teal-600 text-white shadow-lg' : 'text-teal-100 hover:bg-teal-800'}`}>
                            <Users size={20} /> Patients & AI
                        </button>
                    </nav>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-3 text-teal-200 hover:text-white transition opacity-80 hover:opacity-100"><LogOut size={20} /> Logout</button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 md:ml-64">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Hello, {settings.doctorName} 👋</h1>
                        <p className="text-teal-600 font-medium">Welcome to your AI Dashboard</p>
                    </div>
                </header>

                {activeTab === 'appointments' && renderAppointments()}
                {activeTab === 'patients' && renderPatients()}
            </main>
        </div>
    );
};

export default DoctorDashboard;
