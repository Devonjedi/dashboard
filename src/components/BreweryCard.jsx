import { Link } from 'react-router-dom'
import './BreweryCard.css'

function BreweryCard({ brewery }) {
  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  };

  return (
    <div className="brewery-card">
      <h3 className="brewery-name">{brewery.name}</h3>
      <div className="brewery-type">
        <span className={`badge ${brewery.brewery_type}`}>{brewery.brewery_type}</span>
      </div>
      <div className="brewery-details">
        <p className="brewery-address">
          <i className="fa fa-map-marker" aria-hidden="true"></i>
          {brewery.city}, {brewery.state}
        </p>
        <p className="brewery-phone">
          <i className="fa fa-phone" aria-hidden="true"></i>
          {formatPhone(brewery.phone)}
        </p>
        {brewery.website_url && (
          <p className="brewery-website">
            <i className="fa fa-globe" aria-hidden="true"></i>
            <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </p>
        )}
      </div>
      <Link to={`/brewery/${brewery.id}`} className="view-details-button">
        View Details
      </Link>
    </div>
  )
}

export default BreweryCard
