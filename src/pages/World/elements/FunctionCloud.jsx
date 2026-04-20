import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import Cloud from "./Cloud";

export default function FloatingCloud({
  position = [0, 6, -5],
  scale = 1,
  speed = 0.001,
}) {
  const ref = useRef();
  const startX = position[0];

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Movimiento simple de izquierda a derecha
    ref.current.position.x = startX + Math.sin(clock.getElapsedTime() * 0.5) * 1.5;
  });

  return <Cloud ref={ref} position={position} scale={scale} />;
}