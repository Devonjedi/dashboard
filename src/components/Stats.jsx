import './Stats.css'

function Stats({ data, filtered }) {
  // Count breweries by type
  const typeCount = data.reduce((acc, brewery) => {
    const type = brewery.brewery_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Get the top 3 brewery types
  const topTypes = Object.entries(typeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Count breweries by state
  const stateCount = data.reduce((acc, brewery) => {
    const state = brewery.state || 'unknown';
    acc[state] = (acc[state] || 0) + 1;
    return acc;
  }, {});

  // Get the top 3 states
  const topStates = Object.entries(stateCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>Total Breweries</h3>
        <p className="stat-value">{data.length}</p>
      </div>

      <div className="stat-card">
        <h3>Filtered Results</h3>
        <p className="stat-value">{filtered.length}</p>
      </div>

      <div className="stat-card">
        <h3>Top Brewery Types</h3>
        <ul className="stat-list">
          {topTypes.map(([type, count]) => (
            <li key={type}>
              <span className="stat-label">{type}:</span>
              <span className="stat-count">{count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="stat-card">
        <h3>Top States</h3>
        <ul className="stat-list">
          {topStates.map(([state, count]) => (
            <li key={state}>
              <span className="stat-label">{state}:</span>
              <span className="stat-count">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Stats
