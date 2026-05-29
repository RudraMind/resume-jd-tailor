import { useEffect, useRef, useState } from 'react';

function getColor(score, max) {
  const pct = (score / max) * 100;
  if (pct <= 40) return { text: 'text-red-500', bar: 'bg-red-500' };
  if (pct <= 65) return { text: 'text-amber-500', bar: 'bg-amber-500' };
  return { text: 'text-green-500', bar: 'bg-green-500' };
}

export default function ScoreDisplay({ score, max = 100, size = 'lg' }) {
  const [displayed, setDisplayed] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(progress * score));
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [score]);

  const { text, bar } = getColor(score, max);
  const pct = (score / max) * 100;
  const isLg = size === 'lg';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-1">
        <span className={`font-mono font-bold ${isLg ? 'text-4xl' : 'text-2xl'} ${text}`}>
          {displayed}
        </span>
        <span className={`text-gray-400 ${isLg ? 'text-lg' : 'text-sm'}`}>/{max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${bar} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
