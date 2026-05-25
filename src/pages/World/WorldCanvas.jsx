import { Canvas } from "@react-three/fiber";
import FloatingCloud from "./elements/FunctionCloud";
import Sea from "./elements/Sea";
import { useEffect, useRef } from "react";

export default function WorldCanvas({ children }) {
    const containerRef = useRef(null);
useEffect(() => {
  const style = document.createElement("style");
  style.id = "a11y-fix";
  style.textContent = `
  .drei-html-portal,
  [class*="drei"] {
    overflow: hidden !important;
  }

  .drei-html {
    position: fixed !important;
    overflow: visible !important;
  }


  html, body, #root {
    position: fixed !important;
    inset: 0 !important;
    overflow: hidden !important;
    max-width: 100vw !important;
    max-height: 100vh !important;
  }
`;
  document.head.appendChild(style);

  const originalScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(...args) {
    if (
      this.hasAttribute?.("data-a11y") ||
      this.closest?.("[data-a11y]") ||
      this.closest?.("canvas")
    ) {
      return; 
    }
    return originalScrollIntoView.apply(this, args);
  };

  const onFocus = () => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  };
  window.addEventListener("focus", onFocus, true);

  return () => {
    document.getElementById("a11y-fix")?.remove();
    Element.prototype.scrollIntoView = originalScrollIntoView;
    window.removeEventListener("focus", onFocus, true);
  };
}, []);
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    
   
    const canvasContainer = containerRef.current;
    if (canvasContainer) {
      canvasContainer.addEventListener("scroll", preventScroll, { passive: false });
    }
    
    const preventWindowScroll = (e) => {
      if (e.target.tagName === "CANVAS" || e.target.closest("[data-a11y]")) {
        e.preventDefault();
      }
    };
    window.addEventListener("scroll", preventWindowScroll, { passive: false });

    return () => {
      if (canvasContainer) {
        canvasContainer.removeEventListener("scroll", preventScroll);
      }
      window.removeEventListener("scroll", preventWindowScroll);
    };
  }, []);

  return (
 <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        isolation: "isolate",
        contain: "strict",
      }}
    >
      <Canvas
        shadows
        camera={{ position: [6, 6, 10], fov: 40, near: 0.1, far: 100 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",   
          height: "100%", 
          display: "block",
        }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
        gl={{ 
          antialias: true,
          pixelRatio: Math.min(window.devicePixelRatio, 2)
        }}
      >
        <color attach="background" args={["#87CEEB"]} />
       
        <ambientLight intensity={1.2} color="#ffffff" />

        <directionalLight
          position={[10, 20, 5]}
          intensity={1.5}
          color="#fff5e6"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <directionalLight position={[0, -5, 0]} intensity={0.5} color="#aaddff" />

        <directionalLight
          position={[0, 10, -10]}
          intensity={0.8}
          color="#ffffff"
        />

        <pointLight position={[0, 5, 10]} intensity={0.6} color="#ffffff" />

        <directionalLight
          position={[-10, 10, 0]}
          intensity={0.5}
          color="#ffeedd"
        />

        <directionalLight
          position={[10, 10, 0]}
          intensity={0.5}
          color="#ffeedd"
        />

        <FloatingCloud position={[-4, 7, -8]} scale={1.2} speed={0.001} />
        <FloatingCloud position={[2, 6.5, -10]} scale={0.9} speed={0.0008} />
        <FloatingCloud position={[6, 7.5, -9]} scale={1.1} speed={0.0012} />
        <FloatingCloud position={[0, 8, -12]} scale={1.0} speed={0.0009} />
        <FloatingCloud position={[-2, 7.2, -6]} scale={0.8} speed={0.0011} />
        <FloatingCloud position={[4, 6.8, -7]} scale={0.9} speed={0.001} />

        <Sea position={[0, -6, 0]} size={300} />

      
        {children}
      </Canvas>
    </div>
  );
}