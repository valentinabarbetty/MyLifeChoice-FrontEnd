import Village from "./../environments/Village";
import Player from "./../characters/Player";
import CameraManager from "./../camera/FollowCamera";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export default function WorldScene({
  worldNPCs,
  mode,
  playerPos,
  setPlayerPos,
  nearNPC,
  setNpcPositions,
  setActiveNPC,
  setMode,
}) {
  const playerPosRef = useRef(new THREE.Vector3());
  const lastUpdateRef = useRef(0);
  return (
    <>
      <Village />


      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[60, 1, 60]} position={[0, -3.5, 0]} />
        <CuboidCollider args={[1, 1.5, 1]} position={[0.74, -2.2, -0.77]} />
        <CuboidCollider args={[2.5, 1.5, 1.8]} position={[11.64, -2.2, -1.6]} />
        <CuboidCollider args={[0.5, 5, 0.5]} position={[10.03, -2.2, -5.05]} />
        <CuboidCollider
          args={[1.3, 1.5, 1.2]}
          position={[17.16, -2.2, -7.35]}
        />
        <CuboidCollider
          args={[1.5, 0.5, 1.2]}
          position={[19.05, -2.2, -9.42]}
        />
        <CuboidCollider args={[1, 0.5, 0.5]} position={[21.66, -2.2, -1.7]} />
        <CuboidCollider args={[1, 1, 1]} position={[23.43, -2.2, -0.9]} />
        <CuboidCollider args={[1.3, 1, 1.7]} position={[21.4, -2.2, -16.41]} />

        <CuboidCollider args={[2, 2, 2]} position={[12.85, -2.2, -17.56]} />
        <CuboidCollider args={[2, 2, 2]} position={[15.32, -2.2, -27.37]} />
        <CuboidCollider args={[0.5, 4, 2]} position={[17.66, -2.2, -27.75]} />
        <CuboidCollider args={[0.5, 5, 0.5]} position={[9.24, -2.2, -24.59]} />
        <CuboidCollider args={[2, 2, 2]} position={[5.86, -2.2, -23.35]} />
        <CuboidCollider args={[2, 2, 2]} position={[6.39, -2.2, -32.74]} />
      </RigidBody>

    
      <Player
        mode={mode}
        spawnPosition={[0, -2.8, -10]}
        onMove={(pos) => {
          playerPosRef.current.copy(pos); 
          //setPlayerPos(pos);
        }}
      />


      <CameraManager mode={mode} playerPosRef={playerPosRef} scene="WORLD" />
    </>
  );
}
