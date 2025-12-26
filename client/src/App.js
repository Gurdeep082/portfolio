  import React from 'react';
import './App.css';
import SpaceBackground from './components/spacebackground';

function App() {
  return (
    <div className="App">
      <SpaceBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Your other app content goes here */}
        <h1>Welcome to the Space App</h1>
      </div>
    </div>
      

  );
}

export default App;
