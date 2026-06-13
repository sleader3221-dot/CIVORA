import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zones } from "../data/demo";

export function useLiveTelemetry() {
  const [tick, setTick] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [liveClock, setLiveClock] = useState(new Date());
  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((current) => current + 1);
      setLastUpdated(new Date());
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const clock = window.setInterval(() => {
      setLiveClock(new Date());
    }, 1000);
    return () => window.clearInterval(clock);
  }, []);

  const liveZones = useMemo(
    () =>
      zones.map((zone, index) => {
        const wave = Math.sin((tick + index * 2) / 2);
        const wave2 = Math.cos((tick + index) / 3);
        return {
          ...zone,
          temperature: Math.round((zone.temperature + wave * 0.7 + wave2 * 0.3) * 10) / 10,
          noise: Math.max(50, Math.min(100, Math.round(zone.noise + wave * 2 + wave2))),
          airQuality: Math.max(60, Math.min(100, Math.round(zone.airQuality - wave + wave2 * 0.5))),
          workers: Math.max(0, Math.round(zone.workers + wave2 * 0.5))
        };
      }),
    [tick]
  );

  const getZoneById = useCallback(
    (id: string) => liveZones.find((z) => z.id === id),
    [liveZones]
  );

  return {
    zones: liveZones,
    lastUpdated,
    online: navigator.onLine,
    liveClock,
    tick,
    getZoneById
  };
}
