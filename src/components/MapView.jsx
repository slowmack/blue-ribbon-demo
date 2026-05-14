import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';
import { ZONE_LEGEND } from '../data/customers.js';

const NWA_CENTER = [36.25, -94.18];
const DEFAULT_ZOOM = 10;

// When routes are provided, color each customer by its crew's color.
function buildCustomerColorMap(routes) {
  if (!routes) return null;
  const map = new Map();
  for (const route of routes) {
    for (const stop of route.stops) {
      map.set(stop.id, route.color);
    }
  }
  return map;
}

export default function MapView({ customers, routes }) {
  const customerColors = buildCustomerColorMap(routes);
  const showingRoutes = Boolean(routes);

  return (
    <div className="map-wrap">
      <MapContainer
        center={NWA_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        preferCanvas
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {showingRoutes &&
          routes.map((route) => (
            <Polyline
              key={route.crewId}
              positions={route.stops.map((s) => [s.lat, s.lng])}
              pathOptions={{
                color: route.color,
                weight: 2,
                opacity: 0.7,
              }}
            />
          ))}

        {customers.map((c) => {
          const color = customerColors?.get(c.id) ?? c.zoneColor;
          return (
            <CircleMarker
              key={c.id}
              center={[c.lat, c.lng]}
              radius={showingRoutes ? 3.5 : 4}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.9,
                weight: 1,
              }}
            >
              <Tooltip>
                <strong>{c.id}</strong> · {c.city}<br />
                {c.address}<br />
                {c.propertySize} lot · {c.frequency}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {!showingRoutes && (
        <div className="legend">
          <h3>Zones</h3>
          {ZONE_LEGEND.map((z) => (
            <div key={z.name} className="legend-row">
              <span className="legend-dot" style={{ background: z.color }} />
              <span>{z.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
