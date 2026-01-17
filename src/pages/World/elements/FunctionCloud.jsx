import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import Cloud from "./Cloud";

export default function FloatingCloud({
  position = [0, 6, -5],
  scale = 1,
  speed = 0.001,
}) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;

    ref.current.position.x += speed;

    if (ref.current.position.x > 12) {
      ref.current.position.x = -12;
    }
  });

  return <Cloud ref={ref} position={position} scale={scale} />;
}
