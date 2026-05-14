import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip } from 'react-leaflet';

const NWA_CENTER = [36.25, -94.18];
const DEFAULT_ZOOM = 10;
const FALLBACK_COLOR = '#94a3b8';

export default function MapView({ customers, routes, customerColors, trucks, visitedIds }) {
  const showingRoutes = Boolean(routes && routes.length > 0);
  const showingTrucks = Boolean(trucks && trucks.length > 0);

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
                weight: showingTrucks ? 2.5 : 2,
                opacity: 0.65,
              }}
            />
          ))}

        {customers.map((c) => {
          const color = customerColors?.get(c.id) ?? FALLBACK_COLOR;
          const isVisited = visitedIds?.has(c.id);
          return (
            <CircleMarker
              key={c.id}
              center={[c.lat, c.lng]}
              radius={showingRoutes ? 3.5 : 4}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: isVisited ? 0.2 : 0.9,
                opacity: isVisited ? 0.3 : 0.9,
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

        {showingTrucks &&
          trucks.map((t) => (
            <CircleMarker
              key={`truck-${t.crewId}`}
              center={[t.lat, t.lng]}
              radius={8}
              pathOptions={{
                color: '#ffffff',
                fillColor: t.color,
                fillOpacity: 1,
                weight: 3,
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
}
