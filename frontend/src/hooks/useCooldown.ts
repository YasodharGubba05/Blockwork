import { useEffect, useState } from 'react';
import { useGridStore } from '../store';

export function useCooldown() {
  const until = useGridStore((s) => s.cooldownUntil);
  const total = useGridStore((s) => s.cooldownMs);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!until) return;
    const t = setInterval(() => setNow(Date.now()), 50);
    return () => clearInterval(t);
  }, [until]);

  const diff = Math.max(0, until - now);
  const active = diff > 0;
  const pct = active ? (diff / total) : 0;

  return { 
    onCooldown: active, 
    remainingMs: diff, 
    progress: pct 
  };
}
