import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaQrcode, FaMoneyBillWave, FaCheckCircle, FaMapMarkerAlt, FaTruck } from 'react-icons/fa';
import './Booking.css';

const Booking = () => {
  const location = useLocation();
  const selectedService = location.state?.selectedService || null;

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    full_address: '',
    preferred_date: '',
    preferred_time: '',
    payment_option: '',
    service_category: selectedService ? selectedService.category : 'General'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [eta, setEta] = useState(0);

  // Today's Date for min attribute in date picker
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateTime = (timeStr) => {
    if (!timeStr) return false;
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (hours < 9 || hours > 21) return false;
    if (hours === 21 && minutes > 0) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic frontend validation
    if (formData.phone_number.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    if (!validateTime(formData.preferred_time)) {
      toast.error('Please select a time between 9:00 AM and 9:00 PM');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/xyz/backend/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setIsSuccess(true);
      setBookingDetails(data.booking);
      setEta(Math.floor(Math.random() * 30) + 15); // Random ETA between 15-45 mins
      toast.success('Booking Successful!');
      
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && bookingDetails) {
    return (
      <div className="booking-container container section tracking-section">
        <div className="tracking-card glass-panel animate-fade-in">
          <div className="tracking-header">
            <FaCheckCircle className="success-icon pulse" />
            <h2>Booking Confirmed!</h2>
            <p>Your expert is on the way. Track their live location below.</p>
          </div>

          <div className="expert-details-box">
            <div className="expert-info">
              <h3>{bookingDetails.provider_name || 'Fixmate Expert'}</h3>
              <p>{bookingDetails.service_category}</p>
            </div>
            <div className="eta-box">
              <h4>ETA</h4>
              <span className="eta-time">{eta} <small>min</small></span>
            </div>
          </div>

          <div className="demo-map-container">
            <div className="map-overlay">
              <div className="map-route"></div>
              <FaMapMarkerAlt className="map-pin destination-pin" />
              <div className="vehicle-tracker">
                <FaTruck className="tracker-icon" />
              </div>
            </div>
          </div>

          <div className="tracking-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
            <button className="btn btn-outline" onClick={() => toast('Connecting to provider...', {icon: '📞'})}>
              Call Provider
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container container section">
      {/* Decorative Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="booking-header">
        <h1 className="title">Book a Service</h1>
        {selectedService ? (
          <p className="subtitle" style={{ color: 'var(--primary-color)', fontWeight: 'bold', marginTop: '0.5rem' }}>
            Selected Service: {selectedService.name}
          </p>
        ) : (
          <p className="subtitle">Fill out the details below to schedule your expert service.</p>
        )}
      </div>

      <div className="booking-content">
        <form className="booking-form glass-card" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input 
              type="text" 
              id="full_name" 
              name="full_name" 
              required 
              placeholder="e.g. Rahul Sharma"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input 
              type="tel" 
              id="phone_number" 
              name="phone_number" 
              required 
              pattern="[0-9]{10,12}"
              placeholder="10-digit mobile number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="full_address">Complete Address</label>
            <textarea 
              id="full_address" 
              name="full_address" 
              required 
              rows="3"
              placeholder="House/Flat No., Building Name, Street, Landmark, City, Pincode"
              value={formData.full_address}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preferred_date">Preferred Date</label>
              <input 
                type="date" 
                id="preferred_date" 
                name="preferred_date" 
                required 
                min={today}
                value={formData.preferred_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="preferred_time">Preferred Time (9 AM - 9 PM)</label>
              <input 
                type="time" 
                id="preferred_time" 
                name="preferred_time" 
                required 
                min="09:00"
                max="21:00"
                value={formData.preferred_time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="payment-section full-width">
            <label className="section-label">Select Payment Option</label>
            <div className="payment-options">
              <label className={`payment-card ${formData.payment_option === 'UPI' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment_option" 
                  value="UPI" 
                  checked={formData.payment_option === 'UPI'}
                  onChange={handleChange}
                />
                <div className="payment-card-content">
                  <FaQrcode className="payment-icon" />
                  <span>Pay via UPI</span>
                </div>
              </label>

              <label className={`payment-card ${formData.payment_option === 'Cash After Service' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  name="payment_option" 
                  value="Cash After Service" 
                  checked={formData.payment_option === 'Cash After Service'}
                  onChange={handleChange}
                />
                <div className="payment-card-content">
                  <FaMoneyBillWave className="payment-icon" />
                  <span>Pay After Service</span>
                </div>
              </label>
            </div>
            
            {/* Mock QR Code Display conditionally rendered */}
            {formData.payment_option === 'UPI' && (
              <div className="mock-qr-container pulse-animation">
                <h4>Scan to Pay (Mock)</h4>
                <div className="qr-placeholder">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=fixmate@upi&pn=FixmateServices" alt="UPI QR Code" />
                </div>
                <p>Scan with PhonePe, GPay, or Paytm</p>
              </div>
            )}
          </div>

          <div className="form-actions full-width">
            {formData.payment_option && (
              <p className="payment-instruction" style={{ marginBottom: '1rem', fontWeight: '500', color: 'var(--text-color)' }}>
                {formData.payment_option === 'UPI' 
                  ? 'After scanning to pay, click Book Now below to finalize your booking.' 
                  : 'Click Book Now below to confirm your Cash on Delivery booking.'}
              </p>
            )}
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? <span className="btn-spinner"></span> : 'Book Now'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Booking;
