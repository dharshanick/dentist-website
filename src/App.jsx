import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import ChatBot from './components/ChatBot';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Website */}
                <Route path="/" element={<Home />} />

                {/* Doctor Portal */}
                <Route path="/doctor" element={<DoctorLogin />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            </Routes>
            {/* --- ADD CHATBOT HERE --- */}
            <ChatBot />
        </Router>
    );
}

export default App;
