import { useState } from 'react'
import './Controls.css'

function Controls({
  search,
  onSearch,
  stateFilter,
  onStateFilter,
  typeFilter,
  onTypeFilter,
  states,
  types,
  sortOrder,
  onSortChange,
  viewType,
  onViewChange
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`controls ${isExpanded ? 'expanded' : ''}`}>
      <div className="controls-header">
        <h2>Filters & Controls</h2>
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide' : 'Show'} options
        </button>
      </div>

      <div className="controls-body">
        {/* Search */}
        <div className="control-group">
          <label htmlFor="search">Search by name or city:</label>
          <input
            id="search"
            type="text"
            placeholder="Type to search..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* State Filter */}
        <div className="control-group">
          <label htmlFor="state-filter">Filter by state:</label>
          <select
            id="state-filter"
            value={stateFilter}
            onChange={(e) => onStateFilter(e.target.value)}
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="control-group">
          <label htmlFor="type-filter">Filter by brewery type:</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => onTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="control-group">
          <label htmlFor="sort-order">Sort by:</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
            <option value="cityAsc">City (A-Z)</option>
            <option value="cityDesc">City (Z-A)</option>
            <option value="stateAsc">State (A-Z)</option>
            <option value="stateDesc">State (Z-A)</option>
          </select>
        </div>

        {/* View Type */}
        <div className="control-group">
          <label>View as:</label>
          <div className="view-toggle">
            <button
              className={viewType === 'grid' ? 'active' : ''}
              onClick={() => onViewChange('grid')}
            >
              Grid
            </button>
            <button
              className={viewType === 'list' ? 'active' : ''}
              onClick={() => onViewChange('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controls
