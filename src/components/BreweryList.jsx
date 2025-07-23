import './BreweryList.css'
import BreweryCard from './BreweryCard'

function BreweryList({ loading, list, viewType }) {
  if (loading) {
    return <div className="loading">Loading breweries...</div>
  }

  if (list.length === 0) {
    return <div className="no-results">No breweries found matching your filters.</div>
  }

  return (
    <div className={`brewery-list ${viewType}`}>
      {list.map(brewery => (
        <BreweryCard key={brewery.id} brewery={brewery} />
      ))}
    </div>
  )
}

export default BreweryList
