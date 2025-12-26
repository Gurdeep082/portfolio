import React, { useRef, useState } from 'react';
import './App.css';
import SpaceBackground from './components/spacebackground';
import audioFile from './music/space-440026.mp3';

function App() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.play();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="App">
      <SpaceBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Your other app content goes here */}
        <h1>Welcome to the Space App</h1>
        <button onClick={toggleMute} style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>
      <audio ref={audioRef} src={audioFile} loop muted={isMuted} />
    </div>
      

  );
}

export default App;
