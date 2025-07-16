export default function CharacterCard({ char, viewType }) {
  const { name, description, comics, series, thumbnail } = char;

  // Handle various image URL issues
  const getImageUrl = () => {
    if (!thumbnail || !thumbnail.path || !thumbnail.extension) {
      return `https://via.placeholder.com/300x450/232323/ffffff?text=${name.replace(/\s+/g, '+')}`;
    }

    // Fix for Marvel's image_not_available
    if (thumbnail.path.includes('image_not_available')) {
      return `https://via.placeholder.com/300x450/232323/ffffff?text=${name.replace(/\s+/g, '+')}`;
    }

    // Check for protocol issue (http vs https)
    let path = thumbnail.path;
    if (path.startsWith('http:')) {
      path = path.replace('http:', 'https:');
    }

    return `${path}.${thumbnail.extension}`;
  };

  return (
    <div className={`character-card ${viewType}`}>
      <img
        src={getImageUrl()}
        alt={name}
        className="character-image"
        onError={(e) => {
          // If image fails to load, replace with placeholder
          e.target.src = `https://via.placeholder.com/300x450/232323/ffffff?text=${name.replace(/\s+/g, '+')}`;
        }}
      />
      <div className="character-info">
        <h3>{name}</h3>
        <p className="description">{description || 'No description available.'}</p>
        <div className="character-stats">
          <span>Comics: {comics?.available || 0}</span>
          <span>Series: {series?.available || 0}</span>
        </div>
      </div>
    </div>
  );
}
