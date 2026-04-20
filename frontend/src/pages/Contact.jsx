import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhoneCall, FiMail, FiSend, FiCheckCircle, FiChevronDown, FiPlus, FiMinus } from 'react-icons/fi';
import './Contact.css';

const faqs = [
  {
    question: "How quickly can a service professional reach me?",
    answer: "For premium services, we typically dispatch professionals within 2-4 hours of booking confirmation depending on availability and your location."
  },
  {
    question: "Do you offer warranties on repairs?",
    answer: "Yes! Fixmate provides a 30-day service warranty on all completed repairs. If an issue arises related to the same fault, our professionals will fix it free of charge."
  },
  {
    question: "What forms of payment do you accept?",
    answer: "We accept all major UPI applications (GPay, PhonePe, Paytm), Credit/Debit cards via our secure portal, and Cash on Delivery once the service is fulfilled."
  },
  {
    question: "Can I reschedule or cancel a booking?",
    answer: "Absolutely. You can reschedule or cancel for free up to 2 hours before the scheduled service time directly from your user dashboard."
  }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="contact-page animate-fade-in">
      {/* Decorative Background */}
      <div className="contact-blob contact-blob-1"></div>
      <div className="contact-blob contact-blob-2"></div>

      <div className="container section">
        <div className="contact-header">
          <h1 className="title">Get in Touch</h1>
          <p className="subtitle">
            Have a question about our services? Need priority support? Drop us a message and our support team will assist you within minutes.
          </p>
        </div>

        <div className="contact-container">
          {/* Left Side: Contact Information */}
          <div className="contact-info-card glass-panel">
            <h2 className="info-title">Contact Information</h2>
            <p className="info-desc">Reach out directly or fill the form. We respond to all inquiries within 24 hours.</p>

            <div className="info-items">
              <div className="info-item">
                <div className="icon-wrapper">
                  <FiPhoneCall />
                </div>
                <div>
                  <h4>Phone Support</h4>
                  <p>+91 00000 00000</p>
                  <p>+91 12345 67890 (Toll Free)</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="icon-wrapper">
                  <FiMail />
                </div>
                <div>
                  <h4>Email Us</h4>
                  <p>support@fixmateglobal.com</p>
                  <p>partners@fixmateglobal.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-wrapper">
                  <FiMapPin />
                </div>
                <div>
                  <h4>Head Office</h4>
                  <p>4th Floor, Skyline Towers,</p>
                  <p>Connaught Place, New Delhi</p>
                  <p>Delhi 110001, India</p>
                </div>
              </div>
            </div>

            {/* Simulated Map Graphic overlay */}
            <div className="mock-map-graphic">
              <div className="radar-ping"></div>
              <FiMapPin className="map-pin-icon" />
            </div>
            
            {/* Decorative Abstract Map/Circle */}
            <div className="abstract-decoration">
              <div className="abstract-circle"></div>
              <div className="abstract-circle small"></div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-wrapper glass-panel">
            {isSuccess ? (
              <div className="contact-success-message fade-in">
                <FiCheckCircle className="success-icon" />
                <h2>Message Sent!</h2>
                <p>
                  Thank you for reaching out to Fixmate. A member of our team will review your inquiry and get back to you shortly.
                </p>
                <button 
                  onClick={() => { 
                    setIsSuccess(false); 
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); 
                  }} 
                  className="submit-btn contact-btn"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3 className="form-title">Send a Message</h3>
                <div className="form-row">
                  <div className="form-group floating-label-group">
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="floating-input"
                      placeholder=" "
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                    <label htmlFor="name" className="floating-label">Your Name</label>
                  </div>
                  <div className="form-group floating-label-group">
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      className="floating-input"
                      placeholder=" "
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                    />
                    <label htmlFor="phone" className="floating-label">Phone Number</label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group floating-label-group">
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="floating-input"
                      placeholder=" "
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                    <label htmlFor="email" className="floating-label">Email Address</label>
                  </div>
                  <div className="form-group floating-label-group select-group">
                    <select 
                      id="subject" 
                      name="subject" 
                      className="floating-input select-input"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled hidden></option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Service Support">Service Support</option>
                      <option value="Billing Issue">Billing Issue</option>
                      <option value="Partnership">Partnership/Business</option>
                    </select>
                    <label htmlFor="subject" className="floating-label">Topic of Inquiry</label>
                    <FiChevronDown className="select-icon" />
                  </div>
                </div>

                <div className="form-group full-width floating-label-group">
                  <textarea 
                    id="message" 
                    name="message" 
                    rows="5"
                    className="floating-input"
                    placeholder=" "
                    value={formData.message}
                    onChange={handleChange}
                    required 
                  ></textarea>
                  <label htmlFor="message" className="floating-label">Describe your issue in detail...</label>
                </div>

                <button type="submit" className="submit-btn contact-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    <>Send Message <FiSend className="btn-icon" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section fade-in stagger-1">
          <div className="faq-header text-center">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common support queries.</p>
          </div>
          
          <div className="faq-accordion">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-card glass-panel ${activeFaq === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <div className="faq-icon">
                    {activeFaq === index ? <FiMinus /> : <FiPlus />}
                  </div>
                </div>
                <div className="faq-answer-wrapper">
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
