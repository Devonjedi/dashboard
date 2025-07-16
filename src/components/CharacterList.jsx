import CharacterCard from './CharacterCard';

export default function CharacterList({ loading, list, viewType }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading characters...</p>
      </div>
    );
  }

  if (!list.length) {
    return (
      <div className="no-results">
        <p>No characters found matching your criteria.</p>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className={`character-list ${viewType}`}>
      {list.map(char => (
        <CharacterCard
          key={char.id}
          char={char}
          viewType={viewType}
        />
      ))}
    </div>
  );
}
