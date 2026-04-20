import { Link } from 'react-router-dom';
import { FiTool, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand">
              <FiTool /> Fix<span>mate</span>
            </Link>
            <p className="footer-desc">
              Your trusted partner for everyday home services. Professional, reliable, and just a click away.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="social-icon" aria-label="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Quick Links</h3>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/services">Services</Link>
              <Link to="/testimonials">Testimonials</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Services</h3>
            <div className="footer-links">
              <Link to="/services?type=electrician">Electrician</Link>
              <Link to="/services?type=plumbing">Plumbing</Link>
              <Link to="/services?type=cleaning">Cleaning</Link>
              <Link to="/services?type=carpentry">Carpentry</Link>
              <Link to="/services?type=painting">Painting</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Contact Us</h3>
            <div className="footer-links">
              <span>dummy@example.com</span>
              <span>+91 00000 00000</span>
              <span>Skyline Towers, Connaught Place</span>
              <span>New Delhi 110001, India</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Fixmate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
