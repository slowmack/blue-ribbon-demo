import { useMemo, useState } from 'react';
import MapView from './components/MapView.jsx';
import CrewSidebar from './components/CrewSidebar.jsx';
import { generateCustomers } from './data/customers.js';
import { generateCrews } from './data/crews.js';
import { buildRandomRoutes, buildOptimizedRoutes, fleetStats } from './lib/routing.js';

export default function App() {
  const customers = useMemo(() => generateCustomers(300, 1337), []);
  const crews = useMemo(() => generateCrews(), []);

  const randomRoutes = useMemo(
    () => buildRandomRoutes(customers, crews, 42),
    [customers, crews]
  );
  const optimizedRoutes = useMemo(
    () => buildOptimizedRoutes(customers, crews),
    [customers, crews]
  );

  const randomStats = useMemo(() => fleetStats(randomRoutes), [randomRoutes]);
  const optimizedStats = useMemo(() => fleetStats(optimizedRoutes), [optimizedRoutes]);

  const [mode, setMode] = useState('setup');

  const activeRoutes =
    mode === 'random' ? randomRoutes :
    mode === 'optimized' ? optimizedRoutes :
    null;

  return (
    <div className="app">
      <CrewSidebar
        crews={crews}
        mode={mode}
        onModeChange={setMode}
        routes={activeRoutes}
        randomStats={randomStats}
        optimizedStats={optimizedStats}
      />
      <MapView customers={customers} routes={activeRoutes} />
    </div>
  );
}
