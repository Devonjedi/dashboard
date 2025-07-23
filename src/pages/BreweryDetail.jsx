import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './BreweryDetail.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function BreweryDetail({ breweries, loading }) {
  const { id } = useParams()
  const [brewery, setBrewery] = useState(null)
  const [nearbyBreweries, setNearbyBreweries] = useState([])

  useEffect(() => {
    // Find the brewery with the matching ID
    const foundBrewery = breweries.find(b => b.id === id)
    setBrewery(foundBrewery)

    // If we have coordinates, find nearby breweries
    if (foundBrewery && foundBrewery.latitude && foundBrewery.longitude) {
      const nearby = breweries
        .filter(b =>
          b.id !== id &&
          b.latitude &&
          b.longitude &&
          calculateDistance(
            parseFloat(foundBrewery.latitude),
            parseFloat(foundBrewery.longitude),
            parseFloat(b.latitude),
            parseFloat(b.longitude)
          ) < 50 // Within 50 miles
        )
        .slice(0, 5) // Limit to 5 nearby breweries

      setNearbyBreweries(nearby)
    }
  }, [breweries, id])

  // Calculate distance between two coordinates in miles (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const toRad = (value) => {
    return value * Math.PI / 180;
  }

  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return 'Not available';
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phone;
  };

  if (loading) {
    return <div className="loading-detail">Loading brewery details...</div>
  }

  if (!brewery) {
    return (
      <div className="brewery-not-found">
        <h2>Brewery Not Found</h2>
        <p>Sorry, we couldn't find a brewery with the ID: {id}</p>
        <Link to="/" className="back-link">Return to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="brewery-detail-container">
      <div className="detail-header">
        <Link to="/" className="back-link">← Back to Dashboard</Link>
        <h1>{brewery.name}</h1>
        <span className={`brewery-type-badge ${brewery.brewery_type}`}>
          {brewery.brewery_type}
        </span>
      </div>

      <div className="detail-content">
        <div className="detail-info">
          <h2>Brewery Information</h2>

          <div className="info-section">
            <h3>Location</h3>
            <p><strong>Address:</strong> {brewery.street || 'Not available'}</p>
            <p><strong>City:</strong> {brewery.city}, {brewery.state}</p>
            <p><strong>Postal Code:</strong> {brewery.postal_code}</p>
            <p><strong>Country:</strong> {brewery.country}</p>
          </div>

          <div className="info-section">
            <h3>Contact</h3>
            <p><strong>Phone:</strong> {formatPhone(brewery.phone)}</p>
            {brewery.website_url && (
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href={brewery.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {brewery.website_url}
                </a>
              </p>
            )}
          </div>

          <div className="info-section">
            <h3>Additional Details</h3>
            <p><strong>Type:</strong> {brewery.brewery_type}</p>
            <p><strong>Added to Database:</strong> {new Date(brewery.created_at).toLocaleDateString()}</p>
            <p><strong>Last Updated:</strong> {new Date(brewery.updated_at).toLocaleDateString()}</p>
          </div>
        </div>

        {brewery.latitude && brewery.longitude ? (
          <div className="map-container">
            <h2>Location Map</h2>
            <MapContainer
              center={[parseFloat(brewery.latitude), parseFloat(brewery.longitude)]}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[parseFloat(brewery.latitude), parseFloat(brewery.longitude)]}>
                <Popup>
                  <strong>{brewery.name}</strong><br />
                  {brewery.street}<br />
                  {brewery.city}, {brewery.state}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="no-map">
            <h2>Location Map</h2>
            <p>Map coordinates not available for this brewery.</p>
          </div>
        )}
      </div>

      {nearbyBreweries.length > 0 && (
        <div className="nearby-breweries">
          <h2>Nearby Breweries</h2>
          <div className="nearby-list">
            {nearbyBreweries.map(nearby => (
              <Link
                to={`/brewery/${nearby.id}`}
                key={nearby.id}
                className="nearby-brewery-card"
              >
                <h3>{nearby.name}</h3>
                <p>{nearby.city}, {nearby.state}</p>
                <span className={`nearby-type ${nearby.brewery_type}`}>
                  {nearby.brewery_type}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BreweryDetail
