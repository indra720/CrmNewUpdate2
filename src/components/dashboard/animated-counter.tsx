'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

type AnimatedCounterProps = {
  from: number;
  to: number;
  prefix?: string;
  postfix?: string;
};

export function AnimatedCounter({ from, to, prefix, postfix }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(to);
    }
  }, [motionValue, inView, to]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix || ''}${Intl.NumberFormat('en-US').format(
          latest.toFixed(0)
        )}${postfix || ''}`;
      }
    });
    return unsubscribe;
  }, [springValue, prefix, postfix]);

  return <span ref={ref} />;
}
