import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import BreweryDetail from './pages/BreweryDetail'
import './App.css'

// Fallback data moved to a separate file to avoid duplication
import { FALLBACK_DATA } from './data/fallbackData'

function App() {
  // State management
  const [breweries, setBreweries] = useState(FALLBACK_DATA)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch data from Open Brewery DB API
  const fetchBreweryData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Construct the API URL for Open Brewery DB
      const url = "https://api.openbrewerydb.org/v1/breweries?per_page=50";
      console.log("Fetching from:", url)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch data from Brewery API')
      }

      const data = await response.json()

      if (data && data.length > 0) {
        setBreweries(data)
        console.log(`Loaded ${data.length} breweries from API`)
      } else {
        throw new Error('No breweries found in API response')
      }
    } catch (err) {
      console.error('Error fetching brewery data:', err)
      setError(`Failed to load from API: ${err.message}`)
      // Continue using fallback data if we already have it
      if (breweries.length === 0) {
        setBreweries(FALLBACK_DATA)
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchBreweryData()
  }, [])

  return (
    <Router>
      <div className="app-container">
        <Header title="Brewery Explorer Dashboard" />

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                breweries={breweries}
                loading={loading}
                error={error}
                refreshData={fetchBreweryData}
              />
            }
          />
          <Route
            path="/brewery/:id"
            element={
              <BreweryDetail
                breweries={breweries}
                loading={loading}
              />
            }
          />
        </Routes>

        <footer className="footer">
          <p>Data provided by Open Brewery DB © {new Date().getFullYear()}</p>
          <div className="footer-buttons">
            <button onClick={fetchBreweryData} className="refresh-button">
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
