export default function Stats({ data, filtered }) {
  // Calculate stats from the data
  const total = data.length;
  const withDescription = data.filter(char => char.description?.trim()).length;
  const avgComics = total ?
    Math.round(data.reduce((sum, char) => sum + (char.comics?.available || 0), 0) / total) : 0;
  const maxComics = Math.max(...data.map(char => char.comics?.available || 0));

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Characters</h3>
        <p>{total}</p>
      </div>
      <div className="stat-card">
        <h3>With Descriptions</h3>
        <p>{withDescription}</p>
      </div>
      <div className="stat-card">
        <h3>Avg Comics</h3>
        <p>{avgComics}</p>
      </div>
      <div className="stat-card">
        <h3>Filtered Results</h3>
        <p>{filtered.length}</p>
      </div>
    </div>
  );
}
