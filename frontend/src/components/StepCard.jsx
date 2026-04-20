import './StepCard.css';

const StepCard = ({ number, title, description }) => {
  return (
    <div className="step-card animate-slide-up">
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default StepCard;
