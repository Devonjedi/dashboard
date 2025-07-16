import { useState, useEffect } from 'react'
import * as CryptoJS from 'crypto-js'
import Header from './components/Header'
import Stats from './components/Stats'
import Controls from './components/Controls'
import CharacterList from './components/CharacterList'
import './App.css'

// Fallback data remains the same
// ...existing FALLBACK_DATA array...
const FALLBACK_DATA = [
  {
    id: 1,
    name: "Spider-Man",
    description: "Bitten by a radioactive spider, high school student Peter Parker gained the speed, strength and powers of a spider.",
    comics: { available: 30 },
    series: { available: 10, items: [{ name: "Amazing Spider-Man" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b", extension: "jpg" }
  },
  {
    id: 2,
    name: "Iron Man",
    description: "Genius inventor Tony Stark creates a suit of armor to save his life and fight evil as Iron Man.",
    comics: { available: 25 },
    series: { available: 8, items: [{ name: "Iron Man" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55", extension: "jpg" }
  },
  {
    id: 3,
    name: "Captain America",
    description: "Super-Soldier Steve Rogers fights for American ideals as one of the world's mightiest heroes.",
    comics: { available: 28 },
    series: { available: 9, items: [{ name: "Captain America" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/537ba56d31087", extension: "jpg" }
  },
  {
    id: 4,
    name: "Thor",
    description: "Norse god of thunder and hero who wields the enchanted hammer Mjolnir.",
    comics: { available: 35 },
    series: { available: 12, items: [{ name: "Thor" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/d/d0/5269657a74350", extension: "jpg" }
  },
  {
    id: 5,
    name: "Black Widow",
    description: "Russian spy turned hero who is a skilled combatant and member of the Avengers.",
    comics: { available: 22 },
    series: { available: 7, items: [{ name: "Black Widow" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b", extension: "jpg" }
  },
  {
    id: 6,
    name: "Hulk",
    description: "Dr. Bruce Banner transforms into the incredible Hulk when he gets angry or stressed.",
    comics: { available: 40 },
    series: { available: 15, items: [{ name: "Hulk" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/538615ca33ab0", extension: "jpg" }
  },
  {
    id: 7,
    name: "Doctor Strange",
    description: "Former surgeon who became the Sorcerer Supreme, Earth's protector against magical threats.",
    comics: { available: 18 },
    series: { available: 6, items: [{ name: "Doctor Strange" }, { name: "Defenders" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/5/f0/5261a85a501fe", extension: "jpg" }
  },
  {
    id: 8,
    name: "Black Panther",
    description: "King of the advanced African nation Wakanda and mighty warrior with enhanced abilities.",
    comics: { available: 20 },
    series: { available: 8, items: [{ name: "Black Panther" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/1/c0/537ba2bfd6bab", extension: "jpg" }
  },
  {
    id: 9,
    name: "Captain Marvel",
    description: "Carol Danvers received cosmic powers to become one of the universe's most powerful heroes.",
    comics: { available: 15 },
    series: { available: 5, items: [{ name: "Captain Marvel" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/c/10/537ba5ff07aa4", extension: "jpg" }
  },
  {
    id: 10,
    name: "Scarlet Witch",
    description: "Wanda Maximoff has reality-altering magical abilities that make her incredibly powerful.",
    comics: { available: 12 },
    series: { available: 4, items: [{ name: "Scarlet Witch" }, { name: "Avengers" }] },
    thumbnail: { path: "https://i.annihil.us/u/prod/marvel/i/mg/6/70/5261a7d7c394b", extension: "jpg" }
  }
];

function App() {
  const [chars, setChars] = useState(FALLBACK_DATA)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [seriesFilter, setSeriesFilter] = useState('')
  const [comicsRange, setComicsRange] = useState([0, 100])
  const [viewType, setViewType] = useState('grid')
  const [sortOrder, setSortOrder] = useState('nameAsc')

  // Get API keys from environment variables
  const PUBLIC_KEY = import.meta.env.VITE_MARVEL_PUBLIC_KEY
  const PRIVATE_KEY = import.meta.env.VITE_MARVEL_PRIVATE_KEY

  // Fetch data from Marvel API
  const fetchMarvelData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if API keys exist
      if (!PUBLIC_KEY || !PRIVATE_KEY) {
        throw new Error('Marvel API keys are not configured')
      }

      // Create timestamp and hash for Marvel API authentication
      const ts = Date.now().toString()
      const hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString()

      // Construct the API URL
      const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=50`

      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch data from Marvel API')
      }

      const data = await response.json()

      if (data.data && data.data.results) {
        setChars(data.data.results)
        console.log(`Loaded ${data.data.results.length} characters from Marvel API`)
      } else {
        throw new Error('Invalid response format from Marvel API')
      }
    } catch (err) {
      console.error('Error fetching Marvel data:', err)
      setError(`Failed to load from API: ${err.message}`)
      // Continue using fallback data
    } finally {
      setLoading(false)
    }
  }

  // Try to fetch data on component mount
  useEffect(() => {
    // Attempt to fetch from API initially
    fetchMarvelData()
  }, [])

  // Filter characters based on all criteria
  const filteredChars = chars.filter(char => {
    // Text search
    const nameMatch = char.name.toLowerCase().includes(search.toLowerCase())
    const descMatch = char.description?.toLowerCase().includes(search.toLowerCase()) || false
    const matchesSearch = nameMatch || descMatch

    // Series filter
    const matchesSeries = !seriesFilter ||
                         char.series?.items?.some(s => s.name === seriesFilter) || false

    // Comics range filter
    const comicsCount = char.comics?.available || 0
    const matchesComicsRange = comicsCount >= comicsRange[0] &&
                              comicsCount <= comicsRange[1]

    return matchesSearch && matchesSeries && matchesComicsRange
  }).sort((a, b) => {
    // Sort logic
    switch(sortOrder) {
      case 'nameAsc': return a.name.localeCompare(b.name)
      case 'nameDesc': return b.name.localeCompare(a.name)
      case 'comicsAsc': return (a.comics?.available || 0) - (b.comics?.available || 0)
      case 'comicsDesc': return (b.comics?.available || 0) - (a.comics?.available || 0)
      default: return 0
    }
  })

  return (
    <div className="app-container">
      <Header title="Marvel Characters Dashboard" />

      <main className="dashboard">
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        <Stats
          data={chars}
          filtered={filteredChars}
        />

        <Controls
          search={search}
          onSearch={setSearch}
          seriesFilter={seriesFilter}
          onFilter={setSeriesFilter}
          data={chars}
          comicsRange={comicsRange}
          onComicsRangeChange={setComicsRange}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          viewType={viewType}
          onViewChange={setViewType}
        />

        <CharacterList
          loading={loading}
          list={filteredChars}
          viewType={viewType}
        />
      </main>

      <footer className="footer">
        <p>Data provided by Marvel © {new Date().getFullYear()}</p>
        <button onClick={fetchMarvelData} className="refresh-button">
          {loading ? 'Loading...' : 'Refresh Data from API'}
        </button>
      </footer>
    </div>
  )
}

export default App
