import { useState } from 'react';

export default function Controls({
  search,
  onSearch,
  seriesFilter,
  onFilter,
  data,
  comicsRange,
  onComicsRangeChange,
  sortOrder,
  onSortChange,
  viewType,
  onViewChange
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Extract unique series for dropdown
  const seriesList = Array.from(
    new Set(data.flatMap(char =>
      char.series?.items?.map(s => s.name) || []
    ))
  ).sort();

  // Find max comics count for range slider
  const maxComics = Math.max(
    ...data.map(char => char.comics?.available || 0),
    100 // Minimum max value
  );

  return (
    <div className="controls">
      <div className="basic-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <select
            value={seriesFilter}
            onChange={(e) => onFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Series</option>
            {seriesList.map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>
        </div>

        <div className="view-toggle">
          <button
            onClick={() => onViewChange('grid')}
            className={`view-button ${viewType === 'grid' ? 'active' : ''}`}
          >
            Grid
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`view-button ${viewType === 'list' ? 'active' : ''}`}
          >
            List
          </button>
        </div>
      </div>

      <button
        className="advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
      </button>

      {showAdvanced && (
        <div className="advanced-controls">
          <div className="comics-range">
            <label>Comics Appearances: {comicsRange[0]} - {comicsRange[1]}</label>
            <div className="range-inputs">
              <input
                type="range"
                min="0"
                max={maxComics}
                value={comicsRange[0]}
                onChange={(e) => onComicsRangeChange([parseInt(e.target.value), comicsRange[1]])}
                className="range-slider"
              />
              <input
                type="range"
                min="0"
                max={maxComics}
                value={comicsRange[1]}
                onChange={(e) => onComicsRangeChange([comicsRange[0], parseInt(e.target.value)])}
                className="range-slider"
              />
            </div>
          </div>

          <div className="sort-controls">
            <label>Sort By:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="sort"
                  checked={sortOrder === 'nameAsc'}
                  onChange={() => onSortChange('nameAsc')}
                />
                Name (A-Z)
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  checked={sortOrder === 'nameDesc'}
                  onChange={() => onSortChange('nameDesc')}
                />
                Name (Z-A)
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  checked={sortOrder === 'comicsAsc'}
                  onChange={() => onSortChange('comicsAsc')}
                />
                Comics (Least to Most)
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  checked={sortOrder === 'comicsDesc'}
                  onChange={() => onSortChange('comicsDesc')}
                />
                Comics (Most to Least)
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
