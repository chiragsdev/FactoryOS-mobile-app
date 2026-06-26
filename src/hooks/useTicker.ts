import { useState, useEffect } from 'react';

/**
 * Returns the current Date.now() value, ticking every second.
 * Attach to any component that needs a live running timer.
 */
export function useTicker(): number {
  const [tick, setTick] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return tick;
}
