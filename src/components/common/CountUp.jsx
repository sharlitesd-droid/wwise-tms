import { useEffect, useState } from 'react';

export default function CountUp({ value, duration = 1200 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame;
    const startTime = performance.now();

    function animate(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span>{count}</span>;
}
