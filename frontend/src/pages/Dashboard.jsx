import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiClock, FiCheckCircle, FiBox, FiUser, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compute stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending' || !b.status).length;
  const completedBookings = bookings.filter(b => b.status === 'Completed').length;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/xyz/backend/api/bookings');
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        toast.error("Couldn't load admin bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="dashboard-container container section">
      <div className="dashboard-header text-center fade-in">
        <h1 className="title">Admin Dashboard</h1>
        <p className="subtitle">Overview and management of all service requests</p>
      </div>

      {!loading && (
        <div className="stats-grid fade-in stagger-1">
          <div className="stat-card glass-panel">
            <div className="stat-icon-wrapper total">
              <FiBox className="stat-icon" />
            </div>
            <div className="stat-info">
              <h3>{totalBookings}</h3>
              <p>Total Requests</p>
            </div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon-wrapper pending">
              <FiClock className="stat-icon" />
            </div>
            <div className="stat-info">
              <h3>{pendingBookings}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card glass-panel">
            <div className="stat-icon-wrapper completed">
              <FiCheckCircle className="stat-icon" />
            </div>
            <div className="stat-info">
              <h3>{completedBookings}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state fade-in text-center">
          <div className="spinner"></div>
          <p>Loading premium data...</p>
        </div>
      ) : (
        <div className="bookings-wrapper fade-in stagger-2">
          {bookings.length === 0 ? (
            <div className="empty-state glass-panel text-center">
              <div className="empty-icon">
                <FiBox />
              </div>
              <h3>No bookings yet</h3>
              <p>When customers book services, they will magically appear here.</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking, idx) => (
                <div key={booking.id} className="booking-card glass-panel slide-up" style={{ '--animation-order': idx }}>
                  <div className="bc-header">
                    <span className="bc-id">#{booking.id.toString().padStart(4, '0')}</span>
                    <span className={`bc-status status-${booking.status?.toLowerCase() || 'pending'}`}>
                      {booking.status || 'Pending'}
                    </span>
                  </div>
                  
                  <div className="bc-body">
                    <div className="bc-row">
                      <FiUser className="bc-icon text-primary" />
                      <div>
                        <strong>{booking.full_name}</strong>
                        <div className="text-muted">{booking.phone_number}</div>
                      </div>
                    </div>
                    
                    <div className="bc-row">
                      <FiMapPin className="bc-icon text-secondary" />
                      <div className="address-text" title={booking.full_address}>{booking.full_address}</div>
                    </div>

                    <div className="bc-row">
                      <FiCalendar className="bc-icon text-accent" />
                      <div>
                        {booking.preferred_date} <span className="bc-time">{booking.preferred_time}</span>
                      </div>
                    </div>

                    <div className="bc-row">
                      <FiCreditCard className="bc-icon text-success" />
                      <div>
                        <span className={`payment-pill ${booking.payment_option?.toLowerCase() === 'upi' ? 'upi' : 'cash'}`}>
                          {booking.payment_option || 'Cash'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bc-footer">
                    <div className="bc-provider">
                      <span className="provider-label">Provider:</span>
                      {booking.provider_name ? (
                        <span className="provider-name">{booking.provider_name}</span>
                      ) : (
                        <span className="provider-unassigned">Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
