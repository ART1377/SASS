'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
}

export function AnimatedNumber({ value }: AnimatedNumberProps) {
  const spring = useSpring(0, { stiffness: 20, damping: 10 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const display = useTransform(spring, (v) => Math.round(v).toLocaleString('fa-IR'));

  return <motion.span>{display}</motion.span>;
}
