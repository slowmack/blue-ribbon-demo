import { useEffect, useMemo, useRef, useState } from 'react';
import MapView from './components/MapView.jsx';
import CrewSidebar from './components/CrewSidebar.jsx';
import { generateCustomers } from './data/customers.js';
import { generateCrews } from './data/crews.js';
import { buildRandomRoutes, buildOptimizedRoutes, fleetStats } from './lib/routing.js';
import { buildWeekSchedule, routesForDay, dayFleetStats, DAY_LABELS } from './lib/schedule.js';
import { positionAlongRoute } from './lib/animation.js';

const ANIM_DURATION_MS = 30000;

export default function App() {
  const customers = useMemo(() => generateCustomers(300, 1337), []);
  const crews = useMemo(() => generateCrews(), []);

  // Routes always built from the full crew roster — toggling crews only
  // affects what's drawn on the map.
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

  const randomWeek = useMemo(
    () => buildWeekSchedule(randomRoutes, crews),
    [randomRoutes, crews]
  );
  const optimizedWeek = useMemo(
    () => buildWeekSchedule(optimizedRoutes, crews),
    [optimizedRoutes, crews]
  );

  const [mode, setMode] = useState('setup');
  const [selectedDay, setSelectedDay] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [visibleCrewIds, setVisibleCrewIds] = useState(
    () => new Set(crews.map((c) => c.id))
  );

  // Reset playback when day or mode changes.
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
  }, [selectedDay, mode]);

  // rAF animation loop.
  const rafRef = useRef();
  const lastTimeRef = useRef();
  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = undefined;
      return;
    }
    function tick(now) {
      if (lastTimeRef.current === undefined) lastTimeRef.current = now;
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;
      setProgress((p) => {
        const next = p + (dt / ANIM_DURATION_MS) * speed;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, speed]);

  const weekSchedule =
    mode === 'random' ? randomWeek :
    mode === 'optimized' ? optimizedWeek :
    null;

  // Full set of routes for the current mode + day (before crew-visibility filter).
  const allActiveRoutes = useMemo(() => {
    if (!weekSchedule) return null;
    if (selectedDay === null) {
      return mode === 'random' ? randomRoutes : optimizedRoutes;
    }
    return routesForDay(weekSchedule, selectedDay);
  }, [mode, selectedDay, weekSchedule, randomRoutes, optimizedRoutes]);

  // Filter to only visible crews — this is what the map renders.
  const visibleRoutes = useMemo(() => {
    if (!allActiveRoutes) return null;
    return allActiveRoutes.filter((r) => visibleCrewIds.has(r.crewId));
  }, [allActiveRoutes, visibleCrewIds]);

  // Setup mode has no active routes, but customers still need a canonical
  // crew assignment (for the visibility toggle and the dot coloring).
  // The optimized routes are the natural source.
  const setupOwnershipMap = useMemo(() => {
    const m = new Map();
    for (const route of optimizedRoutes) {
      for (const stop of route.stops) m.set(stop.id, route.crewId);
    }
    return m;
  }, [optimizedRoutes]);

  const crewColorById = useMemo(() => {
    const m = new Map();
    for (const c of crews) m.set(c.id, c.color);
    return m;
  }, [crews]);

  // Single source of truth for customer dot colors across all modes. In Setup
  // mode we color by the optimized-route owner so the dot palette has one
  // consistent meaning (crew identity) the whole way through the demo.
  const customerColors = useMemo(() => {
    const m = new Map();
    if (mode === 'setup') {
      for (const [custId, crewId] of setupOwnershipMap) {
        const color = crewColorById.get(crewId);
        if (color) m.set(custId, color);
      }
    } else if (visibleRoutes) {
      for (const r of visibleRoutes) {
        for (const s of r.stops) m.set(s.id, r.color);
      }
    }
    return m;
  }, [mode, setupOwnershipMap, crewColorById, visibleRoutes]);

  // Which customers actually render. In Setup, filter by visible crew via
  // ownership map. In routed modes, the route-stops set IS the visible set.
  const displayedCustomers = useMemo(() => {
    if (mode === 'setup') {
      return customers.filter((c) => {
        const owner = setupOwnershipMap.get(c.id);
        return owner ? visibleCrewIds.has(owner) : false;
      });
    }
    return customers.filter((c) => customerColors.has(c.id));
  }, [customers, mode, setupOwnershipMap, visibleCrewIds, customerColors]);

  // Truck positions + visited stops for visible crews only.
  const playback = useMemo(() => {
    if (!visibleRoutes || selectedDay === null) return null;
    const trucks = [];
    const visitedIds = new Set();
    for (const r of visibleRoutes) {
      const pos = positionAlongRoute(r.stops, progress);
      if (!pos) continue;
      trucks.push({ crewId: r.crewId, color: r.color, lat: pos.lat, lng: pos.lng });
      for (let i = 0; i < pos.visitedCount; i++) {
        visitedIds.add(r.stops[i].id);
      }
    }
    return { trucks, visitedIds };
  }, [visibleRoutes, selectedDay, progress]);

  // Stats panel stays fleet-wide so the before/after headline doesn't shift
  // when the user is just isolating a crew on the map.
  const randomDayStats = useMemo(
    () => (selectedDay !== null ? dayFleetStats(randomWeek, selectedDay) : null),
    [randomWeek, selectedDay]
  );
  const optimizedDayStats = useMemo(
    () => (selectedDay !== null ? dayFleetStats(optimizedWeek, selectedDay) : null),
    [optimizedWeek, selectedDay]
  );

  const periodLabel = selectedDay === null ? 'weekly' : DAY_LABELS[selectedDay];

  // Per-crew route lookup used by the sidebar (uses full route set — sidebar
  // card stats stay accurate even when the crew is hidden).
  const crewRouteLookup = allActiveRoutes;

  function toggleCrewVisibility(crewId) {
    setVisibleCrewIds((prev) => {
      const next = new Set(prev);
      if (next.has(crewId)) next.delete(crewId);
      else next.add(crewId);
      return next;
    });
  }

  function showAllCrews() {
    setVisibleCrewIds(new Set(crews.map((c) => c.id)));
  }

  function showOnlyCrew(crewId) {
    setVisibleCrewIds(new Set([crewId]));
  }

  return (
    <div className="app">
      <CrewSidebar
        crews={crews}
        visibleCrewIds={visibleCrewIds}
        onToggleCrew={toggleCrewVisibility}
        onShowAll={showAllCrews}
        onShowOnly={showOnlyCrew}
        mode={mode}
        onModeChange={setMode}
        routes={crewRouteLookup}
        weekSchedule={weekSchedule}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        isPlaying={isPlaying}
        progress={progress}
        speed={speed}
        onPlayPause={() => {
          if (progress >= 1) setProgress(0);
          setIsPlaying((p) => !p);
        }}
        onReset={() => {
          setIsPlaying(false);
          setProgress(0);
        }}
        onSpeedChange={setSpeed}
        randomStats={selectedDay !== null ? randomDayStats : randomStats}
        optimizedStats={selectedDay !== null ? optimizedDayStats : optimizedStats}
        periodLabel={periodLabel}
      />
      <MapView
        customers={displayedCustomers}
        routes={visibleRoutes}
        customerColors={customerColors}
        trucks={playback?.trucks ?? null}
        visitedIds={playback?.visitedIds ?? null}
      />
    </div>
  );
}
