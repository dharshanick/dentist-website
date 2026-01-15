import React from 'react';
import { motion } from 'framer-motion';

const AIAssistant = () => {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2"
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="glass-panel px-4 py-2 rounded-xl rounded-br-none text-sm font-medium text-gray-700 shadow-lg bg-white/80"
            >
                Ask Dr. AI
            </motion.div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 text-2xl">🤖</span>
            </motion.button>
        </motion.div>
    );
};

export default AIAssistant;
