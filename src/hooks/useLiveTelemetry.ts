import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { equipmentTelemetryInit, weatherData as staticWeather, zones } from "../data/demo";
import type { EquipmentTelemetry, NotificationEvent, WeatherData } from "../types";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

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

  const liveWeather = useMemo((): WeatherData => {
    const hour = liveClock.getHours();
    const wave = Math.sin(tick / 4) * 2;
    const tempVar = Math.sin(hour / 24 * Math.PI * 2) * 3;
    return {
      ...staticWeather,
      temperature: Math.round((staticWeather.temperature + wave + tempVar) * 10) / 10,
      humidity: Math.max(40, Math.min(95, Math.round(staticWeather.humidity + wave * 3))),
      windSpeed: Math.max(3, Math.round(staticWeather.windSpeed + Math.sin(tick / 3) * 4))
    };
  }, [tick, liveClock]);

  const liveEquip = useMemo((): EquipmentTelemetry[] =>
    equipmentTelemetryInit.map((eq) => ({
      ...eq,
      fuelLevel: Math.max(5, Math.min(100, eq.fuelLevel - Math.floor(tick / 60) % 3 + (Math.random() > 0.8 ? -1 : 0))),
      operatingHours: eq.operatingHours + tick * 2 / 3600,
      lastCommunication: new Date(lastUpdated.getTime() - Math.floor(Math.random() * 12000))
    })),
  [tick, lastUpdated]);

  const liveNotifications = useMemo((): NotificationEvent[] => {
    const events: NotificationEvent[] = [];
    if (tick > 0 && tick % 10 === 0) {
      events.push({
        id: `notif-${tick}`,
        title: pick(["Heat stress threshold approaching", "PPE compliance check recommended", "Tool vibration anomaly detected", "Delivery conflict forecast", "Material passport verified"]),
        detail: pick(["WBGT trend requires attention in MEP Corridor", "Vision model flags missing eye protection near cutting station", "Angle grinder vibration 17% above baseline", "Concrete truck arrival overlaps with crane exclusion", "Chain-of-custody record updated for steel batch"]),
        type: "alert",
        severity: tick % 20 === 0 ? "critical" : tick % 15 === 0 ? "warning" : "info",
        time: new Date(),
        read: false
      });
    }
    if (tick > 0 && tick % 30 === 0) {
      events.push({
        id: `notif-milestone-${tick}`,
        title: "Project milestone reached",
        detail: `Phase progress updated to ${Math.round(60 + tick / 5)}% complete`,
        type: "milestone",
        severity: "success",
        time: new Date(),
        read: false
      });
    }
    return events;
  }, [tick]);

  const getZoneById = useCallback(
    (id: string) => liveZones.find((z) => z.id === id),
    [liveZones]
  );

  return {
    zones: liveZones,
    weather: liveWeather,
    equipment: liveEquip,
    notifications: liveNotifications,
    lastUpdated,
    online: navigator.onLine,
    liveClock,
    tick,
    getZoneById
  };
}
