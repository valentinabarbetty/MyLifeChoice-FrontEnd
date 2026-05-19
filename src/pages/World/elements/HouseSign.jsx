import { Text, RoundedBox, Cylinder, Sphere, Box } from "@react-three/drei";
import { useRef, useMemo } from "react";

export default function HouseSign({
  text = "Ingeniería",
  position = [0, 2, 0],
  rotation = [0, 0, 0],
  woodColor = "#8B5A2B",
  metalColor = "#4A4A4A",
}) {
  const groupRef = useRef();
  
  const textLength = text.length;
  
  const config = useMemo(() => {
    if (textLength <= 12) {
      return {
        fontSize: 0.24,
        boardWidth: 3.0,
        boardHeight: 0.75,
        innerWidth: 2.55,
        innerHeight: 0.45,
        maxWidth: 2.3,
        arrowPosition: 1.65
      };
    } else if (textLength <= 20) {
      return {
        fontSize: 0.19,
        boardWidth: 3.4,
        boardHeight: 0.68,
        innerWidth: 2.95,
        innerHeight: 0.42,
        maxWidth: 2.7,
        arrowPosition: 1.9
      };
    } else if (textLength <= 30) {
      return {
        fontSize: 0.16,
        boardWidth: 3.8,
        boardHeight: 0.65,
        innerWidth: 3.35,
        innerHeight: 0.4,
        maxWidth: 3.1,
        arrowPosition: 2.15
      };
    } else {
      return {
        fontSize: 0.14,
        boardWidth: 4.2,
        boardHeight: 0.9,
        innerWidth: 3.75,
        innerHeight: 0.65,
        maxWidth: 3.5,
        arrowPosition: 2.35,
        multiline: true
      };
    }
  }, [textLength]);

  const formattedText = useMemo(() => {
    if (textLength <= 30) return text;
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if ((currentLine + ' ' + word).length <= 18) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    return lines.join('\n');
  }, [text, textLength]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      

      <Cylinder args={[0.09, 0.12, 3.5, 12]} position={[0, -1.3, 0]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={woodColor} 
          roughness={0.7} 
          metalness={0.05}
          emissive="#2a1a0a"
          emissiveIntensity={0.1}
        />
      </Cylinder>

      <Cylinder args={[0.15, 0.13, 0.12, 8]} position={[0, -1.45, 0]} castShadow>
        <meshStandardMaterial color={metalColor} roughness={0.4} metalness={0.7} />
      </Cylinder>

      <group position={[0, 0.5, 0]}>
        <Cylinder args={[0.11, 0.07, 0.15, 8]} position={[0, 0.07, 0]}>
          <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.8} />
        </Cylinder>
        <Sphere args={[0.09, 16, 16]} position={[0, 0.18, 0]}>
          <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} emissive="#D4AF37" emissiveIntensity={0.05} />
        </Sphere>
      </group>


      
      <group position={[0.28, 0, 0]} castShadow>
        
        <Box args={[config.boardWidth + 0.2, 0.08, 0.15]} position={[0, 0, -0.08]} castShadow>
          <meshStandardMaterial color={metalColor} roughness={0.5} metalness={0.6} />
        </Box>

        {[-0.8, 0, 0.8].map((y, i) => (
          <group key={i} position={[-1.45, y, 0]}>
            <Box args={[0.25, 0.06, 0.25]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color={metalColor} roughness={0.3} metalness={0.85} />
            </Box>
            <Sphere args={[0.04, 8, 8]} position={[0.12, 0, 0.12]}>
              <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
            </Sphere>
          </group>
        ))}

        <RoundedBox
          args={[config.boardWidth, config.boardHeight, 0.12]}
          radius={0.12}
          smoothness={8}
          position={[0, 0, 0.02]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color={woodColor} 
            roughness={0.6} 
            metalness={0.03}
            emissive="#3a2010"
            emissiveIntensity={0.05}
          />
        </RoundedBox>

        <RoundedBox
          args={[config.boardWidth - 0.2, config.boardHeight - 0.16, 0.14]}
          radius={0.08}
          smoothness={6}
          position={[0, 0, 0.03]}
        >
          <meshStandardMaterial color="#5C3317" roughness={0.8} metalness={0.02} />
        </RoundedBox>

        <RoundedBox
          args={[config.innerWidth, config.innerHeight, 0.16]}
          radius={0.05}
          smoothness={6}
          position={[0, 0, 0.05]}
        >
          <meshStandardMaterial 
            color="#D2A679" 
            roughness={0.5} 
            metalness={0.01}
            emissive="#8B5A2B"
            emissiveIntensity={0.02}
          />
        </RoundedBox>


        
        <group position={[config.arrowPosition, 0, 0.06]}>
          <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
            <coneGeometry args={[0.38, 0.45, 8]} />
            <meshStandardMaterial color={woodColor} roughness={0.7} metalness={0.03} />
          </mesh>
          
          <mesh rotation={[0, 0, -Math.PI / 2]} position={[0, 0, 0.02]}>
            <coneGeometry args={[0.28, 0.35, 6]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

  
        {[
          -config.boardWidth/2 + 0.4, 
          -config.boardWidth/2 + 1.0, 
          config.boardWidth/2 - 1.0, 
          config.boardWidth/2 - 0.4
        ].map((x, i) => (
          <group key={`screw-${i}`} position={[x, config.boardHeight/2 - 0.15, 0.12]}>
            <Cylinder args={[0.035, 0.04, 0.02, 6]} rotation={[0, 0, 0]}>
              <meshStandardMaterial color="#B8860B" metalness={0.7} roughness={0.4} />
            </Cylinder>
            <Cylinder args={[0.02, 0.02, 0.015, 6]} position={[0, 0.01, 0]}>
              <meshStandardMaterial color="#8B6914" metalness={0.5} roughness={0.5} />
            </Cylinder>
          </group>
        ))}

  
        {[
          -config.boardWidth/2 + 0.4, 
          config.boardWidth/2 - 0.4
        ].map((x, i) => (
          <group key={`screw-bottom-${i}`} position={[x, -config.boardHeight/2 + 0.15, 0.12]}>
            <Cylinder args={[0.035, 0.04, 0.02, 6]} rotation={[0, 0, 0]}>
              <meshStandardMaterial color="#B8860B" metalness={0.7} roughness={0.4} />
            </Cylinder>
            <Cylinder args={[0.02, 0.02, 0.015, 6]} position={[0, 0.01, 0]}>
              <meshStandardMaterial color="#8B6914" metalness={0.5} roughness={0.5} />
            </Cylinder>
          </group>
        ))}

        
        <Text
          position={[-0.15, 0, 0.13]}
          font="/assets/fonts/Roboto-Regular.ttf"
          fontSize={config.fontSize}
          maxWidth={config.maxWidth}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#2A1506"
          outlineWidth={0.008}
          outlineColor="#A0522D"
          outlineBlur={0.002}
          letterSpacing={textLength > 20 ? 0.02 : 0.05}
          lineHeight={1.3}
        >
          {formattedText}
        </Text>


        <Text
          position={[-0.17, -0.02, 0.12]}
          font="/assets/fonts/Roboto-Regular.ttf"
          fontSize={config.fontSize}
          maxWidth={config.maxWidth}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          color="#000000"
          opacity={0.3}
          transparent
        >
          {formattedText}
        </Text>

        
        {textLength > 25 && (
          <Box args={[config.maxWidth - 0.5, 0.04, 0.02]} position={[-0.05, -config.innerHeight/2 + 0.08, 0.14]} castShadow>
            <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.4} />
          </Box>
        )}
      </group>
    </group>
  );
}