import React, { useState, useEffect } from 'react';
import { IdentityModal } from './components/IdentityModal';
import { Header } from './components/Header';
import { Grid } from './components/Grid';
import { Sidebar } from './components/Sidebar';
import { useSocket } from './hooks/useSocket';
import { useGridStore } from './store';

const IDENTITY_KEY = 'grid_capture_identity';

interface Identity {
  username: string;
  color: string;
}

// Separate component so we only init sockets AFTER we have an identity
const Game: React.FC<{ identity: Identity }> = ({ identity }) => {
  useSocket(identity.username, identity.color);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Main board area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'auto', background: '#131110' }}>
          <Grid />
        </div>

        {/* Info panel */}
        <Sidebar />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const setStoreIdentity = useGridStore((s) => s.setIdentity);

  // Load identity from storage on boot
  useEffect(() => {
    try {
      const stored = localStorage.getItem(IDENTITY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username && parsed.color) {
          setIdentity(parsed);
          setStoreIdentity(parsed.username, parsed.color);
        }
      }
    } catch (e) {
      console.warn('identity_load_failed', e);
    }
  }, [setStoreIdentity]);

  const onIdentity = (username: string, color: string) => {
    const id = { username, color };
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(id));
    setIdentity(id);
    setStoreIdentity(username, color);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#131110' }}>
      {!identity ? (
        <IdentityModal onConfirm={onIdentity} />
      ) : (
        <Game identity={identity} />
      )}
    </div>
  );
};

export default App;
