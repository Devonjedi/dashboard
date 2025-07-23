import { useState } from 'react'
import Stats from '../components/Stats'
import Controls from '../components/Controls'
import BreweryList from '../components/BreweryList'
import DataVisualizations from '../components/DataVisualizations'

function Dashboard({ breweries, loading, error, refreshData }) {
  // Filter states
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [viewType, setViewType] = useState('grid')
  const [sortOrder, setSortOrder] = useState('nameAsc')
  const [showCharts, setShowCharts] = useState(true)

  // Filter breweries based on all criteria
  const filteredBreweries = breweries.filter(brewery => {
    // Text search (case insensitive)
    const nameMatch = brewery.name.toLowerCase().includes(search.toLowerCase())
    const cityMatch = brewery.city?.toLowerCase().includes(search.toLowerCase()) || false
    const matchesSearch = nameMatch || cityMatch

    // State filter
    const matchesState = !stateFilter || brewery.state === stateFilter

    // Type filter
    const matchesType = !typeFilter || brewery.brewery_type === typeFilter

    return matchesSearch && matchesState && matchesType
  }).sort((a, b) => {
    // Sort logic
    switch(sortOrder) {
      case 'nameAsc': return a.name.localeCompare(b.name)
      case 'nameDesc': return b.name.localeCompare(a.name)
      case 'cityAsc': return a.city.localeCompare(b.city)
      case 'cityDesc': return b.city.localeCompare(a.city)
      case 'stateAsc': return a.state.localeCompare(b.state)
      case 'stateDesc': return b.state.localeCompare(a.state)
      default: return 0
    }
  })

  // Get unique states for filter dropdown
  const uniqueStates = [...new Set(breweries.map(brewery => brewery.state))].sort()

  // Get unique brewery types for filter dropdown
  const uniqueTypes = [...new Set(breweries.map(brewery => brewery.brewery_type))].sort()

  return (
    <main className="dashboard">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <Stats
        data={breweries}
        filtered={filteredBreweries}
      />

      <div className="chart-controls">
        <h2>Data Visualizations</h2>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className={`toggle-charts-button ${showCharts ? 'active' : ''}`}
        >
          {showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {showCharts && (
        <DataVisualizations
          breweries={breweries}
          filteredBreweries={filteredBreweries}
        />
      )}

      <Controls
        search={search}
        onSearch={setSearch}
        stateFilter={stateFilter}
        onStateFilter={setStateFilter}
        typeFilter={typeFilter}
        onTypeFilter={setTypeFilter}
        states={uniqueStates}
        types={uniqueTypes}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        viewType={viewType}
        onViewChange={setViewType}
      />

      <BreweryList
        loading={loading}
        list={filteredBreweries}
        viewType={viewType}
      />
    </main>
  )
}

export default Dashboard
