import React, { useRef, useState } from 'react';
import './App.css';
import SpaceBackground from './components/spacebackground';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeOff } from '@fortawesome/free-solid-svg-icons';

function App() {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [canPlay, setCanPlay] = useState(false);

  const toggleMute = () => {
    if (isMuted && canPlay) {
      audioRef.current.play().catch(e => console.error('Audio play failed:', e));
    }
    setIsMuted(!isMuted);
  };

  const handleCanPlay = () => {
    setCanPlay(true);
  };

  return (
    <div className="App">
      <SpaceBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Your other app content goes here */}
        <h1>Welcome to the Space App</h1>
        <button onClick={toggleMute} style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>
          <FontAwesomeIcon icon={isMuted ? faVolumeOff : faVolumeUp} />
        </button>
      </div>
      <audio ref={audioRef} src="/music/space-440026.mp3" loop muted={isMuted} onCanPlay={handleCanPlay} onError={(e) => console.error('Audio error:', e)} />
    </div>
      

  );
}

export default App;
