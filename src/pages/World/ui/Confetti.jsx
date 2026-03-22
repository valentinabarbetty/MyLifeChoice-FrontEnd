import { useEffect, useState } from "react";
import Confetti from "react-confetti";

export default function ConfettiEffect() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Confetti
      width={size.width}
      height={size.height}
      numberOfPieces={250}
      gravity={0.3}
      recycle={false}
    />
  );
}