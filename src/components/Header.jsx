export default function Header({ title = "Marvel Characters Dashboard" }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <p>Explore the Marvel Universe with our interactive dashboard</p>
    </header>
  );
}
