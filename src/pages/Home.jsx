import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero_real.png';
import { Star, Quote } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import TrackBookingModal from '../components/TrackBookingModal';
import ServiceDetailModal from '../components/ServiceDetailModal';
import ChatBot from '../components/ChatBot';

// --- DATA: Services ---
const servicesData = [
  {
    id: 1,
    title: "Whitening",
    icon: "✨",
    color: "bg-yellow-100",
    description: "Brighten your smile with laser-focused treatments.",
    fullDescription: "Our advanced Zoom! Whitening technology removes years of stains in just 45 minutes. Safe for sensitive teeth and long-lasting results.",
    duration: "45 - 60 Mins",
    price: "$199 - $299"
  },
  {
    id: 2,
    title: "Cleaning",
    icon: "🛡️",
    color: "bg-blue-100",
    description: "Deep cleaning that feels refreshing, not painful.",
    fullDescription: "Ultrasonic cleaning technology that gently removes plaque and tartar. Includes a comprehensive gum health check and fluoride polish.",
    duration: "30 Mins",
    price: "$99"
  },
  {
    id: 3,
    title: "Surgery",
    icon: "🔧",
    color: "bg-red-100",
    description: "Precision procedures with minimal recovery time.",
    fullDescription: "From wisdom teeth removal to dental implants. We use 3D imaging for precision and offer sedation options for a completely anxiety-free experience.",
    duration: "1 - 2 Hours",
    price: "Consultation Required"
  }
];

// --- DATA: Reviews ---
const reviews = [
  { id: 1, name: "Sarah J.", text: "I was terrified of dentists, but Dr. AI helped me book easily. The surgery was literally painless!", rating: 5 },
  { id: 2, name: "Mike T.", text: "The anti-gravity vibe of the clinic is so relaxing. Best cleaning I've ever had.", rating: 5 },
  { id: 3, name: "Emily R.", text: "Fast, efficient, and super modern. Love the guest checkout feature.", rating: 5 }
];

function Home() {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null); // Tracks which service is clicked

  // Function to open modal, can be passed down to components
  const handleOpenBooking = () => setIsBookingOpen(true);



  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-cyan-50 to-blue-50 font-sans text-gray-900">

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-primary text-3xl">🦷</span> Smart<span className="text-primary">Dent</span>
          </div>
          {/* --- NAVIGATION LINKS (New Button Style) --- */}
          <div className="hidden md:flex items-center gap-4">

            {/* HOME BUTTON */}
            <a href="#home" className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-600 border border-transparent hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300">
              Home
            </a>

            {/* SERVICES BUTTON */}
            <a href="#services" className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-600 border border-transparent hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300">
              Services
            </a>

            {/* REVIEWS BUTTON */}
            <a href="#reviews" className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-600 border border-transparent hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 transition-all duration-300">
              Reviews
            </a>

          </div>
          <button onClick={() => setIsTrackingOpen(true)} className="px-5 py-2 bg-white border border-gray-200 rounded-full text-primary-600 font-bold hover:shadow-md transition-all cursor-pointer">Track Booking</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-blue-50 pt-32 pb-20 px-6 overflow-hidden">

        {/* Background Decor (Soft Blobs) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">

          {/* Left Text Content */}
          <div className="flex-1 space-y-8 z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">
                Lighter Dentistry.
              </span>
            </h1>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
              Modern dental care that feels like floating on air. Painless, precise, and perfectly designed for your comfort.
            </p>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-8 py-4 bg-teal-600 text-white rounded-full font-bold shadow-lg shadow-teal-600/30 hover:shadow-teal-600/50 hover:-translate-y-1 transition-all"
            >
              Book Appointment
            </button>
          </div>

          {/* --- RIGHT SIDE: GIANT IMAGE WITH 3D HOVER EFFECT --- */}
          {/* Added 'group' class here so hovering this container triggers the image effect */}
          <div className="flex-1 flex justify-center relative items-center perspective-1000 min-h-[600px] group z-10">

            {/* 1. Aura Background (Keeps its slow pulse) */}
            <div className="absolute w-full h-full bg-gradient-to-tr from-teal-200 to-blue-200 rounded-full blur-3xl -z-10 animate-pulse-slow opacity-60"></div>

            {/* 2. Particles (Keep their bounce) */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-teal-400 rounded-full animate-bounce delay-100 opacity-50"></div>
            <div className="absolute bottom-10 left-10 w-10 h-10 bg-blue-300 rounded-full animate-pulse delay-700 opacity-50"></div>

            {/* 3. THE IMAGE WITH NEW 3D EFFECT */}
            <img
              src={heroImage}
              alt="Modern Dentistry"
              // --- NEW CLASSES EXPLAINED ---
              // 1. REMOVED 'animate-float'. It is now stationary until hovered.
              // 2. transition-all duration-1000 ease-out: Makes the movement super smooth and slow.
              // 3. group-hover:rotate-y-12: Tilts the image horizontally in 3D when hovered.
              // 4. group-hover:rotate-x-6: Tilts it slightly vertically.
              // 5. group-hover:scale-[1.02]: A tiny, subtle pop forward.
              // 6. group-hover:drop-shadow-[...]: The shadow gets deeper and colored on hover to enhance depth.
              className="w-[115%] max-w-none object-contain relative z-10 mix-blend-multiply filter contrast-110 drop-shadow-2xl origin-center
                           transition-all duration-1000 ease-out transform
                           group-hover:rotate-y-12 group-hover:rotate-x-6 group-hover:scale-[1.02] 
                           group-hover:drop-shadow-[0_35px_35px_rgba(13,148,136,0.4)]"
            />

          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Expertise</h2>
          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {servicesData.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, rotateX: 5 }}
                onClick={() => setSelectedService(service)} // Open Modal on Click
                className="glass-panel p-8 rounded-3xl shadow-lg hover:shadow-2xl cursor-pointer transition-all relative overflow-hidden group"
              >
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm`}>{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-500 mb-6">{service.description}</p>
                <div className="mt-auto text-primary-400 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Read More →</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REVIEWS SECTION --- */}
      <section id="reviews" className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Happy Smiles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative hover:shadow-md transition-shadow"
              >
                <Quote className="absolute top-8 right-8 text-gray-200" size={40} />
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                <div className="font-bold text-gray-900">{review.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FIXED FOOTER (Standard Teal Colors) --- */}
      <footer className="bg-teal-700 text-white py-20 px-6 mt-20 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">About SmartDent</h2>
            <p className="text-teal-50 leading-relaxed mb-6">
              We started with a simple mission: to remove the fear from dentistry.
              By combining AI technology with human expertise, we create an experience
              that is efficient, transparent, and surprisingly pleasant.
            </p>

            {/* Stats Section */}
            <div className="flex gap-4">
              <div className="p-4 bg-teal-800 rounded-2xl text-center shadow-lg">
                <div className="text-2xl font-bold text-teal-200">2k+</div>
                <div className="text-xs text-teal-100/70">Patients</div>
              </div>
              <div className="p-4 bg-teal-800 rounded-2xl text-center shadow-lg">
                <div className="text-2xl font-bold text-teal-200">15</div>
                <div className="text-xs text-teal-100/70">Awards</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact & Hours</h3>
            <ul className="space-y-3 text-teal-50">
              <li className="flex items-center gap-2"><span>📍</span> 123 Floating City, Tech Park</li>
              <li className="flex items-center gap-2"><span>📞</span> +1 (800) SMART-DENT</li>
              <li className="flex items-center gap-2"><span>📧</span> care@smartdent.com</li>
              <li className="pt-4 text-white font-bold border-t border-teal-600 mt-4 inline-block">
                Mon - Sat: 09:00 AM - 08:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-teal-600 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-teal-200">
          <div>
            © 2026 SmartDent Clinic. All rights reserved.
          </div>

          {/* Doctor Login Link */}
          <a
            href="/doctor"
            className="mt-4 md:mt-0 text-white hover:text-teal-200 transition-colors flex items-center gap-2 bg-teal-800 px-3 py-1 rounded-full text-xs"
          >
            <span>🔒</span>
          </a>
        </div>
      </footer>

      {/* --- MODALS --- */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <TrackBookingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookNow={() => { setSelectedService(null); setIsBookingOpen(true); }}
      />

      <ChatBot onOpenBooking={handleOpenBooking} />
    </div>
  );
}

export default Home;
