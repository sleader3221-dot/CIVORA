import { useEffect, useMemo, useState } from "react";
import { zones } from "../data/demo";

export function useLiveTelemetry() {
  const [tick, setTick] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((current) => current + 1);
      setLastUpdated(new Date());
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const liveZones = useMemo(
    () =>
      zones.map((zone, index) => {
        const wave = Math.sin((tick + index * 2) / 2);
        return {
          ...zone,
          temperature: Math.round((zone.temperature + wave * 0.7) * 10) / 10,
          noise: Math.max(50, Math.round(zone.noise + wave * 2)),
          airQuality: Math.max(60, Math.min(100, Math.round(zone.airQuality - wave)))
        };
      }),
    [tick]
  );

  return {
    zones: liveZones,
    lastUpdated,
    online: navigator.onLine
  };
}
