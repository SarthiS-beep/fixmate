import { Link } from 'react-router-dom';
import { FiZap, FiDroplet, FiStar, FiArrowRight } from 'react-icons/fi';
import ServiceCard from '../components/ServiceCard';
import StepCard from '../components/StepCard';
import TestimonialCard from '../components/TestimonialCard';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container hero-content">
          <h1 className="hero-title animate-slide-up">
            Solution for <br/><span>Everyday Problems</span>
          </h1>
          <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Book trusted, verified professionals for all your home service needs. From electrical repairs to deep cleaning, we've got you covered.
          </p>
          <div className="hero-actions animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/services" className="btn btn-primary">
              Book a Service <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ background: 'white' }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-title animate-slide-up">
            <h2>Our Popular Services</h2>
            <p>Reliable professionals at your doorstep</p>
          </div>
          
          <div className="grid-cols-3">
            <ServiceCard 
              icon={FiZap}
              title="Electrician"
              description="Wiring, switchboard repair, fan installation, and thorough electrical troubleshooting."
              slug="electrician"
            />
            <ServiceCard 
              icon={FiDroplet}
              title="Plumbing"
              description="Leak repairs, pipe fitting, blocked drains, and complete bathroom fittings."
              slug="plumbing"
            />
            <ServiceCard 
              icon={FiStar}
              title="Cleaning"
              description="Deep home cleaning, bathroom cleaning, sofa cleaning, and sanitization services."
              slug="cleaning"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>Three simple steps to resolve your problems</p>
          </div>
          
          <div className="steps-container">
            <div style={{ flex: 1 }}>
              <StepCard 
                number="1"
                title="Choose Service"
                description="Browse our wide selection of home services and select what you need."
              />
            </div>
            <div style={{ flex: 1 }}>
              <StepCard 
                number="2"
                title="Pick a Time"
                description="Select a convenient date and time for the professional to arrive."
              />
            </div>
            <div style={{ flex: 1 }}>
              <StepCard 
                number="3"
                title="Relax"
                description="Our verified professional will arrive on time and complete the job perfectly."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section" style={{ background: 'var(--surface-hover)' }}>
        <div className="container">
          <div className="section-title">
            <h2>What Our Customers Say</h2>
            <p>Don't just take our word for it</p>
          </div>
          
          <div className="grid-cols-3">
            <TestimonialCard 
              name="Rahul Sharma"
              role="Homeowner"
              content="The electrician was very polite and fixed our inverter issue within 30 minutes. Highly recommended!"
              rating={5}
            />
            <TestimonialCard 
              name="Priya Patel"
              role="Working Professional"
              content="Booked a deep cleaning service before Diwali. They did a fantastic job, every corner was spotless."
              rating={5}
            />
            <TestimonialCard 
              name="Amit Kumar"
              role="Business Owner"
              content="Very responsive customer support. The plumber arrived exactly on time and the pricing was transparent."
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section container">
        <h2 className="animate-slide-up">Ready to get your problems fixed?</h2>
        <Link to="/services" className="btn btn-primary" style={{ background: 'var(--surface)', color: 'var(--accent)' }}>
          Explore Services
        </Link>
      </section>
    </div>
  );
};

export default Home;
