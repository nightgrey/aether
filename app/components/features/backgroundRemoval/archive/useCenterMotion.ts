import { useEffect, useState } from 'react';
import { useMotionValue, useTransform } from 'framer-motion';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: -1, y: -1 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

const useCenterMotion = () => {
  const mousePosition = useMousePosition();

  const center = { x: global.innerWidth / 2, y: global.innerHeight / 2 };
  const max = { x: global.innerWidth, y: global.innerHeight };

  const _x = useMotionValue(mousePosition.x);
  const _y = useMotionValue(mousePosition.y);

  useEffect(() => {
    _x.set(mousePosition.x);
    _y.set(mousePosition.y);
  }, [_x, _y, mousePosition.x, mousePosition.y]);

  const y = useTransform(_y, [0, center.y, center.y, max.y], [0, 1, 1, 0]);
  const x = useTransform(_x, [0, center.x, center.x, max.x], [0, 1, 1, 0]);
  const avg = useTransform(() => x.get() * y.get());
  const scale = useTransform(avg, [0, 1], [1, 4]);
};
