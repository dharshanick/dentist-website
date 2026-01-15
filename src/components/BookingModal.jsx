import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';

const BookingModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");

    // --- STATE ---
    const [formData, setFormData] = useState({
        service: 'Teeth Cleaning',
        problemType: 'Routine Checkup',
        description: '',
        date: '',
        timeSlot: '',
        name: '', email: '', phone: '', age: '', dob: '', address: ''
    });

    const [availableDates, setAvailableDates] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [bookedRanges, setBookedRanges] = useState([]); // Stores numeric start/end times

    const SERVICE_DURATIONS = {
        "Teeth Cleaning": 30,
        "Whitening": 45,
        "Root Canal": 60,
        "General Checkup": 30,
        "Surgery": 60
    };

    // --- HELPER: Convert "10:00 AM" to Minutes (e.g., 600) ---
    const parseTimeToMinutes = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');

        hours = parseInt(hours);
        minutes = parseInt(minutes);

        if (hours === 12 && modifier === 'AM') hours = 0;
        if (hours !== 12 && modifier === 'PM') hours += 12;

        return hours * 60 + minutes;
    };

    // --- 1. FETCH & PROCESS BOOKINGS ---
    useEffect(() => {
        if (isOpen) {
            fetch('http://localhost:5000/api/appointments')
                .then(res => res.json())
                .then(data => {
                    // Filter active bookings and convert them to math ranges
                    const ranges = data
                        .filter(b => b.status !== 'Cancelled')
                        .map(b => {
                            if (!b.timeSlot) return null;
                            const parts = b.timeSlot.split(' - ');
                            if (parts.length !== 2) return null;
                            return {
                                date: b.date,
                                start: parseTimeToMinutes(parts[0]),
                                end: parseTimeToMinutes(parts[1])
                            };
                        })
                        .filter(Boolean); // Remove nulls
                    setBookedRanges(ranges);
                })
                .catch(err => console.error("Failed to load slots", err));
        }
    }, [isOpen]);

    // --- 2. GENERATE DATES ---
    useEffect(() => {
        const dates = [];
        let today = new Date();
        let daysAdded = 0;

        while (daysAdded < 14) {
            let current = new Date(today);
            current.setDate(today.getDate() + daysAdded);

            if (current.getDay() !== 0) { // Skip Sunday
                dates.push({
                    fullDate: current.toISOString().split('T')[0],
                    dayName: current.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                    dayNumber: current.getDate()
                });
            }
            daysAdded++;
        }
        setAvailableDates(dates);
        if (!formData.date && dates.length > 0) {
            setFormData(prev => ({ ...prev, date: dates[0].fullDate }));
        }
    }, []);

    // --- 3. GENERATE SLOTS WITH OVERLAP CHECK ---
    useEffect(() => {
        if (!formData.service || !formData.date) return;

        const duration = SERVICE_DURATIONS[formData.service] || 30;
        const slots = [];

        let currentTime = 10 * 60; // 10:00 AM
        const endTime = 16 * 60;   // 04:00 PM
        const lunchStart = 13 * 60;
        const lunchEnd = 14 * 60;

        while (currentTime + duration <= endTime) {
            const slotEnd = currentTime + duration;

            // Skip Lunch
            if (slotEnd <= lunchStart || currentTime >= lunchEnd) {

                // --- SMART LOCK LOGIC ---
                // Check if [currentTime, slotEnd] overlaps with ANY booked range for this day
                const isLocked = bookedRanges.some(booking => {
                    if (booking.date !== formData.date) return false;
                    // Overlap Formula: (StartA < EndB) and (EndA > StartB)
                    return currentTime < booking.end && slotEnd > booking.start;
                });

                // Format Text for Display
                const formatTime = (min) => {
                    const h = Math.floor(min / 60);
                    const m = min % 60;
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const displayH = h > 12 ? h - 12 : h;
                    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
                };

                slots.push({
                    time: `${formatTime(currentTime)} - ${formatTime(slotEnd)}`,
                    locked: isLocked
                });
            }
            currentTime += duration;
        }
        setAvailableSlots(slots);
    }, [formData.service, formData.date, bookedRanges]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("✅ Booking Confirmed!");
                onClose();
                setStep(1);
            } else {
                alert("❌ Error booking appointment.");
            }
        } catch (error) {
            alert("❌ Server connection failed.");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
                    className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {step === 1 ? "Select Date & Time" : "Patient Details"}
                            </h2>
                            <p className="text-xs text-gray-500">Step {step} of 2</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-6 custom-scrollbar">
                        {step === 1 ? (
                            <div className="space-y-6">

                                {/* 1. Service Selection */}
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Service & Issue</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <select name="service" value={formData.service} onChange={handleChange} className="w-full p-2 bg-white border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-400">
                                            {Object.keys(SERVICE_DURATIONS).map(s => <option key={s}>{s}</option>)}
                                        </select>
                                        <select name="problemType" value={formData.problemType} onChange={handleChange} className="w-full p-2 bg-white border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-400">
                                            <option>Routine Checkup</option>
                                            <option>Severe Pain</option>
                                            <option>Swelling</option>
                                        </select>
                                    </div>
                                </div>

                                {/* 2. DATE SLIDER */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-3">Select Date</h3>
                                    <div className="flex gap-2 overflow-x-auto pb-4 snap-x custom-scrollbar">
                                        {availableDates.map((d) => (
                                            <button
                                                key={d.fullDate}
                                                onClick={() => setFormData({ ...formData, date: d.fullDate, timeSlot: '' })}
                                                className={`w-14 p-2 rounded-xl border flex flex-col items-center justify-center transition-all snap-start shrink-0
                          ${formData.date === d.fullDate
                                                        ? 'bg-gray-900 text-white border-black shadow-lg scale-105'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                            >
                                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{d.dayName}</span>
                                                <span className="text-lg font-bold">{d.dayNumber}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 3. TIME GRID (SMART LOCKS) */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex justify-between">
                                        Select Time
                                        <span className="text-[10px] font-normal text-gray-400 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-gray-200 rounded-full"></span> Booked
                                            <span className="w-2 h-2 bg-white border border-gray-300 rounded-full"></span> Available
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {availableSlots.map((slotObj) => (
                                            <button
                                                key={slotObj.time}
                                                disabled={slotObj.locked}
                                                onClick={() => setFormData({ ...formData, timeSlot: slotObj.time })}
                                                className={`py-3 px-2 rounded-lg text-xs font-bold border transition-all truncate relative overflow-hidden
                          ${slotObj.locked
                                                        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
                                                        : formData.timeSlot === slotObj.time
                                                            ? 'bg-gray-900 text-white border-black shadow-md'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {slotObj.time}
                                                {slotObj.locked && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 font-bold text-[10px] uppercase text-red-400">
                                                        Booked
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => formData.timeSlot ? setStep(2) : setError("Please select a time slot")}
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-black transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
                                >
                                    Next Step <ChevronRight size={20} />
                                </button>
                                {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}

                            </div>
                        ) : (
                            // STEP 2: DETAILS
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-gray-50 p-4 rounded-2xl mb-4 flex justify-between items-center border border-gray-200">
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase">Selected Slot</div>
                                        <div className="font-bold text-gray-800">{formData.date} • {formData.timeSlot}</div>
                                    </div>
                                    <button onClick={() => setStep(1)} className="text-xs text-blue-600 underline font-bold">Change</button>
                                </div>

                                <div className="space-y-3">
                                    <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gray-400 font-medium" />
                                    <input name="email" type="email" placeholder="Email Address (Required)" onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gray-400" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gray-400" />
                                        <input name="phone" type="tel" placeholder="Phone Number" onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gray-400" />
                                    </div>
                                    <textarea name="description" placeholder="Describe your problem (Optional)" rows="2" onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gray-400 resize-none" />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Back</button>
                                    <button onClick={handleSubmit} className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-all">
                                        Confirm Booking
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookingModal;
