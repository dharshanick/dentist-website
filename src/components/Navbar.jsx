import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ onBookClick, onTrackClick, scrollToSection }) => {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-white/20 h-20 flex items-center"
        >
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                {/* Logo acting as Home Button */}
                <div
                    onClick={() => scrollToSection('home')}
                    className="text-2xl font-bold text-gray-800 cursor-pointer flex items-center gap-2"
                >
                    <span className="text-primary text-3xl">🦷</span> Smart<span className="text-primary">Dent</span>
                </div>

                {/* Center Menu */}
                <div className="hidden md:flex gap-8">
                    <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-primary font-medium transition-colors cursor-pointer">
                        Home
                    </button>
                    <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-primary font-medium transition-colors cursor-pointer">
                        Services
                    </button>
                </div>

                {/* Track Appointment Button */}
                <button
                    onClick={onTrackClick}
                    className="px-6 py-2 bg-white text-primary border border-primary/20 font-semibold rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                    Track Booking
                </button>
            </div>
        </motion.nav>
    );
};

export default Navbar;
