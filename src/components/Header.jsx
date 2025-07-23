import './Header.css'

function Header({ title }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <p className="subtitle">
        Explore breweries across the United States and discover new places to enjoy craft beer.
      </p>
    </header>
  )
}

export default Header
