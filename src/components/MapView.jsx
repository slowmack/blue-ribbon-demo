import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { ZONE_LEGEND } from '../data/customers.js';

const NWA_CENTER = [36.25, -94.18];
const DEFAULT_ZOOM = 10;

export default function MapView({ customers }) {
  return (
    <div className="map-wrap">
      <div className="counts">
        <div className="counts-value">{customers.length}</div>
        <div className="counts-label">Customers</div>
      </div>

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
        {customers.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lng]}
            radius={4}
            pathOptions={{
              color: c.zoneColor,
              fillColor: c.zoneColor,
              fillOpacity: 0.85,
              weight: 1,
            }}
          >
            <Tooltip>
              <strong>{c.id}</strong> · {c.city}<br />
              {c.address}<br />
              {c.propertySize} lot · {c.frequency}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="legend">
        <h3>Zones</h3>
        {ZONE_LEGEND.map((z) => (
          <div key={z.name} className="legend-row">
            <span className="legend-dot" style={{ background: z.color }} />
            <span>{z.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
