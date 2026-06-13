import { useCallback, useEffect, useRef, useState } from "react";
import type { NotificationEvent } from "../types";

export function useNotificationFeed(source: NotificationEvent[]) {
  const [queue, setQueue] = useState<NotificationEvent[]>([]);
  const [active, setActive] = useState<NotificationEvent | null>(null);
  const prevCount = useRef(0);

  useEffect(() => {
    if (source.length <= prevCount.current) {
      prevCount.current = source.length;
      return;
    }
    const newEvents = source.slice(prevCount.current);
    prevCount.current = source.length;
    if (newEvents.length > 0) {
      setQueue((current) => [...current, ...newEvents]);
    }
  }, [source]);

  const dismiss = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    if (active) return;
    if (queue.length === 0) return;
    const next = queue[0];
    setActive(next);
    setQueue((current) => current.slice(1));
    const timer = window.setTimeout(() => { setActive(null); }, 5000);
    return () => window.clearTimeout(timer);
  }, [active, queue]);

  return { active, dismiss };
}
