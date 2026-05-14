import { useMemo } from 'react';
import MapView from './components/MapView.jsx';
import CrewSidebar from './components/CrewSidebar.jsx';
import { generateCustomers } from './data/customers.js';
import { generateCrews } from './data/crews.js';

export default function App() {
  const customers = useMemo(() => generateCustomers(300, 1337), []);
  const crews = useMemo(() => generateCrews(), []);

  return (
    <div className="app">
      <CrewSidebar crews={crews} />
      <MapView customers={customers} />
    </div>
  );
}
