import './TestimonialCard.css';

const TestimonialCard = ({ name, role, content, rating = 5 }) => {
  return (
    <div className="testimonial-card animate-slide-up">
      <div className="quote-icon">"</div>
      <p className="testimonial-content">{content}</p>
      <div className="testimonial-stars">
        {"★".repeat(rating)}{"☆".repeat(5 - rating)}
      </div>
      <div className="testimonial-author">
        <div className="author-avatar">
          {name.charAt(0)}
        </div>
        <div>
          <h4>{name}</h4>
          <span className="author-role">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
