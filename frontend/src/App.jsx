import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import Auth from './pages/Auth';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '80vh', paddingTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
