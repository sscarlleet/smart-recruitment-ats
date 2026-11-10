import { useNavigate } from 'react-router-dom';

// StatCard – a small coloured card showing a number and label
// If onClick or link is provided, the card becomes clickable

function StatCard({ label, value, icon: Icon, color, bgColor, link }) {
  const navigate = useNavigate();

  // If a link is provided, navigate on click
  function handleClick() {
    if (link) {
      navigate(link);
    }
  }

  return (
    <div
      className="stat-card"
      onClick={handleClick}
      style={{ cursor: link ? 'pointer' : 'default' }}
    >
      <div className="stat-icon" style={{ background: bgColor }}>
        <Icon size={22} color={color} />
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;
