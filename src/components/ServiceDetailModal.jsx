import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, DollarSign, ShieldCheck } from 'lucide-react';

const ServiceDetailModal = ({ service, onClose, onBookNow }) => {
    if (!service) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full z-10 transition-colors">
                        <X size={20} />
                    </button>

                    {/* Left Side: Image/Icon Visual */}
                    <div className={`w-full md:w-1/3 ${service.color} p-8 flex items-center justify-center`}>
                        <div className="text-6xl">{service.icon}</div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="w-full md:w-2/3 p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{service.title}</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">{service.fullDescription}</p>

                        {/* Key Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 text-primary font-bold mb-1">
                                    <Clock size={16} /> Duration
                                </div>
                                <div className="text-gray-700 text-sm">{service.duration}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 text-green-600 font-bold mb-1">
                                    <DollarSign size={16} /> Price
                                </div>
                                <div className="text-gray-700 text-sm">{service.price}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => { onClose(); onBookNow(); }}
                            className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg"
                        >
                            Book This Service
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ServiceDetailModal;
