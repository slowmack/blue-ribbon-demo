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

  const [enabledCrewIds, setEnabledCrewIds] = useState(
    () => new Set(crews.map((c) => c.id))
  );
  const enabledCrews = useMemo(
    () => crews.filter((c) => enabledCrewIds.has(c.id)),
    [crews, enabledCrewIds]
  );

  const randomRoutes = useMemo(
    () => buildRandomRoutes(customers, enabledCrews, 42),
    [customers, enabledCrews]
  );
  const optimizedRoutes = useMemo(
    () => buildOptimizedRoutes(customers, enabledCrews),
    [customers, enabledCrews]
  );

  const randomStats = useMemo(() => fleetStats(randomRoutes), [randomRoutes]);
  const optimizedStats = useMemo(() => fleetStats(optimizedRoutes), [optimizedRoutes]);

  const randomWeek = useMemo(
    () => buildWeekSchedule(randomRoutes, enabledCrews),
    [randomRoutes, enabledCrews]
  );
  const optimizedWeek = useMemo(
    () => buildWeekSchedule(optimizedRoutes, enabledCrews),
    [optimizedRoutes, enabledCrews]
  );

  const [mode, setMode] = useState('setup');
  const [selectedDay, setSelectedDay] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  // Reset playback when day, mode, or crew enablement changes (route shapes shift).
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
  }, [selectedDay, mode, enabledCrewIds]);

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

  const activeRoutes = useMemo(() => {
    if (!weekSchedule) return null;
    if (selectedDay === null) {
      return mode === 'random' ? randomRoutes : optimizedRoutes;
    }
    return routesForDay(weekSchedule, selectedDay);
  }, [mode, selectedDay, weekSchedule, randomRoutes, optimizedRoutes]);

  // Truck positions + visited stops, only meaningful when a day is selected.
  const playback = useMemo(() => {
    if (!activeRoutes || selectedDay === null) return null;
    const trucks = [];
    const visitedIds = new Set();
    for (const r of activeRoutes) {
      const pos = positionAlongRoute(r.stops, progress);
      if (!pos) continue;
      trucks.push({ crewId: r.crewId, color: r.color, lat: pos.lat, lng: pos.lng });
      for (let i = 0; i < pos.visitedCount; i++) {
        visitedIds.add(r.stops[i].id);
      }
    }
    return { trucks, visitedIds };
  }, [activeRoutes, selectedDay, progress]);

  // Stats panel: weekly totals when no day selected, daily totals when one is.
  const randomDayStats = useMemo(
    () => (selectedDay !== null ? dayFleetStats(randomWeek, selectedDay) : null),
    [randomWeek, selectedDay]
  );
  const optimizedDayStats = useMemo(
    () => (selectedDay !== null ? dayFleetStats(optimizedWeek, selectedDay) : null),
    [optimizedWeek, selectedDay]
  );

  const periodLabel = selectedDay === null ? 'weekly' : DAY_LABELS[selectedDay];

  function toggleCrew(crewId) {
    setEnabledCrewIds((prev) => {
      const next = new Set(prev);
      if (next.has(crewId)) {
        // Don't allow disabling the last crew — there'd be no one to route the work.
        if (next.size <= 1) return prev;
        next.delete(crewId);
      } else {
        next.add(crewId);
      }
      return next;
    });
  }

  return (
    <div className="app">
      <CrewSidebar
        crews={crews}
        enabledCrewIds={enabledCrewIds}
        onToggleCrew={toggleCrew}
        mode={mode}
        onModeChange={setMode}
        routes={activeRoutes}
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
        customers={customers}
        routes={activeRoutes}
        trucks={playback?.trucks ?? null}
        visitedIds={playback?.visitedIds ?? null}
      />
    </div>
  );
}
