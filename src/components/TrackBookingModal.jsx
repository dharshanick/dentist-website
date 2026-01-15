import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Search, Calendar, Clock, Activity } from 'lucide-react';

const TrackBookingModal = ({ isOpen, onClose }) => {
    const [phone, setPhone] = useState("");
    const [bookings, setBookings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!phone) return;

        setLoading(true);
        setError("");
        setBookings(null);

        try {
            const res = await fetch(`http://localhost:5000/api/appointments/search/${phone}`);
            const data = await res.json();

            if (data.length === 0) {
                setError("No bookings found for this number.");
            } else {
                setBookings(data);
            }
        } catch (err) {
            setError("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Track Your Booking</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="relative mb-6">
                        <input
                            type="tel"
                            placeholder="Enter your Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 font-bold text-gray-700 placeholder-gray-400"
                        />
                        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-teal-600 text-white px-4 rounded-lg font-bold hover:bg-teal-700 transition"
                        >
                            {loading ? "..." : "Check"}
                        </button>
                    </form>

                    {/* Results Area */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                        {error && (
                            <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        {bookings && bookings.map((booking) => (
                            <div key={booking._id} className="border border-gray-100 p-4 rounded-2xl bg-gray-50 flex justify-between items-center hover:shadow-md transition">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-800">{booking.service}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* --- NEW: VIDEO CALL BUTTON FOR PATIENT --- */}
                                    {booking.status === 'Confirmed' && booking.meetingLink && (
                                        <a
                                            href={booking.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-2 inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition animate-pulse"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                            Join Video Call
                                        </a>
                                    )}

                                    <div className="text-xs text-gray-500 flex flex-col gap-1">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {booking.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={12} /> {booking.timeSlot}</span>
                                    </div>
                                </div>
                                {booking.status === 'Pending' && <Activity size={20} className="text-yellow-400 animate-pulse" />}
                                {booking.status === 'Confirmed' && <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>}
                            </div>
                        ))}
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TrackBookingModal;
