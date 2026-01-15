import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ onBookClick }) => {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
            <div className="container max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <div className="z-10 text-center md:text-left">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight"
                    >
                        Experience <br />
                        <span className="text-primary relative inline-block">
                            Lighter
                            <motion.span
                                className="absolute -bottom-2 left-0 w-full h-2 bg-accent/30 rounded-full blur-sm"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, delay: 1 }}
                            />
                        </span> Dentistry.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-6 text-xl text-gray-600 max-w-lg mx-auto md:mx-0"
                    >
                        Modern dental care that feels like floating on air. Painless, precise, and perfectly designed for your comfort.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-10"
                    >
                        <motion.button
                            whileHover={{ y: -5, boxShadow: "0 20px 40px -10px rgba(0, 194, 203, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onBookClick}
                            className="bg-gray-900 text-white text-lg px-8 py-4 rounded-2xl font-semibold shadow-2xl transition-all border border-gray-700 hover:border-primary cursor-pointer"
                        >
                            Book Appointment
                        </motion.button>
                    </motion.div>
                </div>

                {/* Right Content - The Floating Tooth */}
                <div className="relative flex justify-center items-center h-[500px]">
                    {/* Abstract Floating Platform */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.2, delay: 0.5 }}
                        className="absolute bottom-10 w-64 h-24 bg-black/5 rounded-[100%] blur-xl" // Shadow
                    />

                    {/* 3D Tooth Representation */}
                    <motion.div
                        animate={{
                            y: [-20, 20, -20],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 6,
                            ease: "easeInOut"
                        }}
                        className="relative w-80 h-96 bg-white rounded-[3rem] shadow-[inset_-20px_-20px_60px_rgba(200,200,200,0.2),20px_20px_60px_rgba(0,0,0,0.05)] border border-white/50 flex items-center justify-center glass-panel"
                        style={{
                            background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)"
                        }}
                    >
                        {/* Simple Tooth Shape SVG */}
                        <svg viewBox="0 0 24 24" fill="none" className="w-48 h-48 text-primary drop-shadow-2xl">
                            <path d="M12 2C8 2 6 5 6 8C6 11 6 12 8 16L10 20C10.5 21 11.5 22 12 22C12.5 22 13.5 21 14 20L16 16C18 12 18 11 18 8C18 5 16 2 12 2Z"
                                fill="url(#gradient)" strokeWidth="0" />
                            <defs>
                                <linearGradient id="gradient" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#00C2CB" />
                                    <stop offset="1" stopColor="#A0E8EB" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Sparkles */}
                        <motion.div
                            animate={{ scale: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                            className="absolute top-10 right-10 text-accent text-4xl"
                        >✦</motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
        </section>
    );
};

export default Hero;
