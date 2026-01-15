import React from 'react';
import { motion } from 'framer-motion';

const services = [
    { title: 'Whitening', icon: '✨', desc: 'Brighten your smile with our laser-focused treatments.' },
    { title: 'Cleaning', icon: '🛡️', desc: 'Deep cleaning that feels refreshing, not painful.' },
    { title: 'Surgery', icon: '🔧', desc: 'Precision procedures with minimal recovery time.' }
];

const Services = () => {
    return (
        <section id="services" className="py-24 px-6 relative">
            <div className="container max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-800">Our Expertise</h2>
                    <p className="text-gray-500 mt-4">High-tech care for your dental health.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 perspective-1000">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, rotateX: 10 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            whileHover={{
                                y: -15,
                                rotateX: 5,
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                            }}
                            className="glass-panel p-8 rounded-3xl relative overflow-hidden group border border-white/60"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {service.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
