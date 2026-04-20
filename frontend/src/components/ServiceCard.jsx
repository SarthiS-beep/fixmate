import { Link } from 'react-router-dom';
import './ServiceCard.css';

const ServiceCard = ({ icon: Icon, title, description, slug }) => {
  return (
    <div className="service-card animate-slide-up">
      <div className="service-icon-wrapper">
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={`/services?type=${slug}`} className="btn btn-outline">
        Book Now
      </Link>
    </div>
  );
};

export default ServiceCard;
