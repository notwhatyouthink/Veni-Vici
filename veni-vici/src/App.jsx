import './App.css';
import { useState } from 'react';

const App = () => {

  const [currentDog, setCurrentDog] = useState(null);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [history, setHistory] = useState([]);

  const addToBanList = (type, value) => {
    const banItem = { type, value };
    
    const isAlreadyBanned = bannedAttributes.some(
      item => item.type === type && item.value === value
    );
    
    if (!isAlreadyBanned) {
      setBannedAttributes([...bannedAttributes, banItem]);
    }
  };

  const removeFromBanList = (type, value) => {
    setBannedAttributes(
      bannedAttributes.filter(item => !(item.type === type && item.value === value))
    );
  };

  const fetchDog = async () => {
    let attempts = 0;
    let dogData = null;
    
    while (attempts < 20) {
      try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        
        const imageUrl = data.message;
        const urlParts = imageUrl.split('/');
        const breedInfo = urlParts[4];
        
        let breed = breedInfo;
        let subBreed = null;
        
        if (breedInfo.includes('-')) {
          const parts = breedInfo.split('-');
          breed = parts[0];
          subBreed = parts[1];
        }
        
        const isBreedBanned = bannedAttributes.some(
          item => item.type === 'breed' && item.value === breed
        );
        
        const isSubBreedBanned = subBreed && bannedAttributes.some(
          item => item.type === 'subBreed' && item.value === subBreed
        );
        
        if (!isBreedBanned && !isSubBreedBanned) {
          dogData = {
            image: imageUrl,
            breed: breed,
            subBreed: subBreed
          };
          setCurrentDog(dogData);
          setHistory([dogData, ...history]);
          break;
        }
        
        attempts++;
      } catch (error) {
        console.error('Error fetching dog:', error);
        break;
      }
    }
    
    if (attempts >= 20) {
      alert('Could not find a dog that matches your criteria. Try removing some banned attributes!');
    }
  };

  return (
    <div className="App">
      <div className="header">
        <h1>🐕 Veni Vici - Discover Dogs!</h1>
        <h3>Click the button to see a random dog</h3>
        <h3>Sharnica Jeudy Z23582376</h3>
      </div>
      
      <button onClick={fetchDog} className="discover-btn">
        🔍 Discover!
      </button>

      {currentDog && (
        <div className="dog-container">
          <img src={currentDog.image} alt="Random dog" className="dog-image" />
          <div className="dog-info">
            <p className="attribute" onClick={() => addToBanList('breed', currentDog.breed)}>
              <strong>Breed:</strong> {currentDog.breed}
            </p>
            {currentDog.subBreed && (
              <p className="attribute" onClick={() => addToBanList('subBreed', currentDog.subBreed)}>
                <strong>Sub-breed:</strong> {currentDog.subBreed}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="ban-list">
        <h2>🚫 Ban List</h2>
        {bannedAttributes.length === 0 ? (
          <p>Click on any attribute to ban it!</p>
        ) : (
          <div className="banned-items">
            {bannedAttributes.map((item, index) => (
              <div 
                key={index} 
                className="banned-item"
                onClick={() => removeFromBanList(item.type, item.value)}
              >
                {item.value} ❌
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="history">
        <h2>📜 History</h2>
        {history.length === 0 ? (
          <p>No dogs discovered yet!</p>
        ) : (
          <div className="history-grid">
            {history.map((dog, index) => (
              <div key={index} className="history-item">
                <img src={dog.image} alt={dog.breed} />
                <p><strong>{dog.breed}</strong></p>
                {dog.subBreed && <p className="sub-breed">{dog.subBreed}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App;
