import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiFrown } from 'react-icons/fi';
import './Services.css';

const MOCK_SERVICES = [
  {
    id: 1,
    name: 'AC Cleaning & Servicing',
    description: 'Professional AC servicing, filter cleaning, gas refill, and maintenance for peak cooling.',
    price_range: '₹499 - ₹1499',
    category: 'Appliance Repair',
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1469&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Plumbing Services',
    description: 'Fixing leaks, blockages, pipe installations, and complete bathroom fittings.',
    price_range: '₹299 - ₹1999',
    category: 'Plumbing',
    image_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Electrician',
    description: 'Wiring, switchboard repair, appliance installation, and fault finding.',
    price_range: '₹199 - ₹1299',
    category: 'Electrical',
    image_url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1469&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Carpenter',
    description: 'Furniture assembly, door lock repair, custom woodwork, and general carpentry.',
    price_range: '₹399 - ₹2499',
    category: 'Carpentry',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1470&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'RO Filter Cleaning & Service',
    description: 'Comprehensive RO water purifier servicing, filter replacement, and TDS level check.',
    price_range: '₹299 - ₹1299',
    category: 'Appliance Repair',
    image_url: 'images/ro_filter.png'
  },
  {
    id: 6,
    name: 'Pest Control',
    description: 'Effective treatments for cockroaches, termites, bed bugs, and general pest control.',
    price_range: '₹899 - ₹2999',
    category: 'Cleaning & Pest Control',
    image_url: 'images/pest_control.png'
  }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/fixmate/backend/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (err) {
        console.warn("Backend API not reachable. Using fallback mock services.", err);
        setServices(MOCK_SERVICES);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Compute unique categories
  const categories = useMemo(() => {
    const uniqueCats = new Set(services.map(s => s.category));
    return ['All', ...Array.from(uniqueCats)];
  }, [services]);

  // Apply filters
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchCategory = selectedCategory === 'All' || service.category === selectedCategory;
      const matchSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="services-container container">
        <div className="loading-state fade-in text-center" style={{ padding: '6rem 2rem' }}>
          <div className="spinner"></div>
          <p>Loading premium services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-container container">
        <div className="error-message glass-panel text-center fade-in">
          <FiFrown className="error-icon" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1rem', opacity: 0.8 }} />
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-container container section">
      <div className="services-header fade-in">
        <h1 className="title">Our Premium Services</h1>
        <p className="subtitle">
          Professional, reliable, and expert solutions tailored for your home and workplace.
        </p>
      </div>

      {/* Discovery Section */}
      <div className="discovery-section fade-in stagger-1">
        <div className="search-bar-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for a service... (e.g. AC Cleaning, Plumbing)"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map((cat) => (
            <button 
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <div className="no-results glass-panel text-center fade-in">
            <FiSearch className="empty-icon" />
            <h3>No services found</h3>
            <p style={{marginBottom: '1.5rem'}}>We couldn't find any services matching your search criteria.</p>
            <button className="btn btn-outline" onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}>
              Clear Filters
            </button>
          </div>
        ) : (
          filteredServices.map((service, idx) => (
            <div key={service.id} className="service-card glass-panel slide-up" style={{ '--animation-order': idx }}>
              <div className="service-image-wrapper">
                <img src={service.image_url} alt={service.name} className="service-img" />
                <div className="service-category-badge">{service.category}</div>
              </div>
              <div className="service-card-body">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <div className="service-price">
                  <span className="price-label">Price Range:</span>
                  <span className="price-value">{service.price_range}</span>
                </div>
                <Link to="/booking" state={{ selectedService: service }} className="btn btn-primary service-book-btn">
                  Book Now
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Services;
