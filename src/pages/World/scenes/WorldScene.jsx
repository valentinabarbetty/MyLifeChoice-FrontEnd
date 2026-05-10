import Village from "./../environments/Village";
import Player from "./../characters/Player";
import Guide from "./../characters/Guide";
import CameraManager from "./../camera/FollowCamera";
import NPCGroup from "./NPCGroup";
import { useRef } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import Floor from "../environments/Floor";
import Houses from "../Houses";

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
  const villageRef = useRef();

  const handleHouseInteract = (career) => {
    setActiveNPC(career);
    setMode("interact");
  };

  return (
    <>
      <Village ref={villageRef} />
      <Houses onInteract={handleHouseInteract} />

      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[60, 0.5, 60]} position={[0, -3.5, 0]} />
        <RigidBody type="fixed" colliders="trimesh">
          <Floor scale={1.4} position={[3, -4, -20]} />
        </RigidBody>
        <CuboidCollider
          args={[0.5, 1, 15]}
          position={[39.64, -2, 8.6]}
          rotation={[0, -0.98, 0]}
        />
        <CuboidCollider args={[1, 1, 21]} position={[43.88, -2, -6.24]} />
        <CuboidCollider
          args={[0.5, 1, 33]}
          position={[32.04, -2, -29.72]}
          rotation={[0, -2.4, 0]}
        />
        <CuboidCollider args={[18, 1, 1.5]} position={[9.3, -2, -44.09]} />
        <CuboidCollider
          args={[0.5, 1, 7.5]}
          position={[-2.12, -2, -41.66]}
          rotation={[0, 0.6, 0]}
        />
        <CuboidCollider
          args={[0.5, 2, 5.5]}
          position={[-1.05, -2, -30.49]}
          rotation={[0, -0.7, 0]}
        />
        <CuboidCollider
          args={[0.5, 1, 6]}
          position={[-9.5, -2, -26.27]}
          rotation={[0, -1.4, 0]}
        />
        <CuboidCollider args={[11, 1, 1]} position={[-20.88, -2, -25.26]} />
        <CuboidCollider
          args={[0.5, 1, 19]}
          position={[-28.59, -2, -15.04]}
          rotation={[0, -0.2, 0]}
        />
        <CuboidCollider
          args={[0.5, 10, 12]}
          position={[-25.67, -2, -2.8]}
          rotation={[0, 0.7, 0]}
        />
        <CuboidCollider
          args={[0.5, 1, 12]}
          position={[-10.7, -2, 11.56]}
          rotation={[0, 0.9, 0]}
        />
        <CuboidCollider
          args={[0.5, 1, 27]}
          position={[12.05, -2, 16.01]}
          rotation={[0, -1.4, 0]}
        />

        <CuboidCollider args={[1, 3, 1]} position={[36.54, -1, -16.8]} />
        <CuboidCollider args={[3, 3, 3]} position={[29.49, -1, -14.63]} />
        <CuboidCollider args={[2, 2, 1]} position={[17.08, -1, -17.03]} />
        <CuboidCollider args={[3, 3, 3]} position={[19.82, -1, -29.72]} />
        <CuboidCollider args={[1, 3, 1]} position={[23.65, -1, -31.03]} />
        <CuboidCollider args={[4, 3, 5]} position={[8.08, -1, -38.01]} />
        <CuboidCollider args={[3, 3, 2]} position={[6.06, -1, -24.39]} />
        <CuboidCollider args={[3, 3, 2]} position={[11.15, -1, -26.44]} />
        <CuboidCollider args={[2, 3, 2]} position={[-7.25, -1, -23.67]} />
        <CuboidCollider args={[2, 3, 3]} position={[-5.96, -1, -18.18]} />
        <CuboidCollider args={[1.5, 3, 1.5]} position={[0.98, -1, -6.43]} />
        <CuboidCollider args={[3, 3, 2]} position={[4.69, -1, -7.3]} />
        <CuboidCollider args={[1, 3, 1]} position={[14.63, -1, -19.61]} />
        <CuboidCollider args={[1, 3, 1]} position={[12.36, -1, 0.34]} />
        <CuboidCollider args={[4, 3, 3]} position={[16.5, -1, 6.43]} />
        <CuboidCollider args={[3, 3, 2]} position={[23.52, -1, -2.11]} />
        <CuboidCollider args={[1, 3, 1]} position={[25.41, -1, -5.43]} />
        <CuboidCollider args={[1, 3, 1]} position={[29.77, -1, 4.76]} />
        <CuboidCollider args={[2, 3, 2]} position={[-0.51, -1, 7.01]} />
        <CuboidCollider args={[2, 3, 2]} position={[-10.85, -1, 4.15]} />

        <CuboidCollider args={[3, 3, 3]} position={[-19.88, -1, -12.05]} />
      </RigidBody>

      <NPCGroup
        npcs={worldNPCs}
        playerPos={playerPos}
        nearNPC={nearNPC}
        setNpcPositions={setNpcPositions}
        onInteractNPC={(id) => {
          setActiveNPC(id);
          setMode("interact");
        }}
      />

      <Player
        mode={mode}
        spawnPosition={[-3, -2, -8]}
        onMove={(pos) => setPlayerPos(pos)}
        scene="WORLD"
      />

      <Guide
        position={[0, -3, -7]}
        onInteract={() => {
          setActiveNPC("guide");
          setMode("guide");
        }}
      />

      <CameraManager
        scene="WORLD"
        mode={mode}
        playerPos={playerPos}
        villageRef={villageRef}
      />
    </>
  );
}