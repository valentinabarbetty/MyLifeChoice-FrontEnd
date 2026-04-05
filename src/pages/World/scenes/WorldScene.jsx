// import Village from "./../environments/Village";
// import Player from "./../characters/Player";
// import CameraManager from "./../camera/FollowCamera";
// import {
//   RigidBody,
//   CuboidCollider,
//   interactionGroups,
// } from "@react-three/rapier";
// import { useRef } from "react";
// import * as THREE from "three";
// import NPCGroup from "./NPCGroup";

// export default function WorldScene({
//   worldNPCs,
//   mode,
//   playerPos,
//   setPlayerPos,
//   nearNPC,
//   setNpcPositions,
//   setActiveNPC,
//   setMode,
// }) {
//   const playerPosRef = useRef(new THREE.Vector3());
//   const villageRef = useRef();

//   return (
//     <>
//       <Village ref={villageRef} />

//       <RigidBody
//         type="fixed"
//         colliders={false}
//       >
//         {/* Mundo en grupo 0, colisiona con grupo 0 */}
//         <CuboidCollider
//           args={[60, 0.5, 60]}
//           position={[0, -3, 0]}
//           collisionGroups={interactionGroups(0, [0])}
//         />

//         <CuboidCollider
//           args={[1, 1.5, 1]}
//           position={[0.74, -2.2, -0.77]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[2.5, 1.5, 1.8]}
//           position={[11.64, -2.2, -1.6]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[0.5, 5, 0.5]}
//           position={[10.03, -2.2, -5.05]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[1.3, 1.5, 1.2]}
//           position={[17.16, -2.2, -7.35]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[1.5, 0.5, 1.2]}
//           position={[19.05, -2.2, -9.42]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[1, 0.5, 0.5]}
//           position={[21.66, -2.2, -1.7]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[1, 1, 1]}
//           position={[23.43, -2.2, -0.9]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[1.3, 1, 1.7]}
//           position={[21.4, -2.2, -16.41]}
//           collisionGroups={interactionGroups(0, [0])}
//         />

//         <CuboidCollider
//           args={[2, 2, 2]}
//           position={[12.85, -2.2, -17.56]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[2, 2, 2]}
//           position={[15.32, -2.2, -27.37]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[0.5, 4, 2]}
//           position={[17.66, -2.2, -27.75]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[0.5, 5, 0.5]}
//           position={[9.24, -2.2, -24.59]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[2, 2, 2]}
//           position={[5.86, -2.2, -23.35]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//         <CuboidCollider
//           args={[2, 2, 2]}
//           position={[6.39, -2.2, -32.74]}
//           collisionGroups={interactionGroups(0, [0])}
//         />
//       </RigidBody>

//       <Player
//   mode={mode}
//   spawnPosition={[0, 0, -10]}
//   onMove={(pos) => {
//     playerPosRef.current.copy(pos);
//   }}
// />

//       <NPCGroup
//         npcs={worldNPCs}
//         playerPos={playerPos}
//         nearNPC={nearNPC}
//         setNpcPositions={setNpcPositions}
//         onInteractNPC={(id) => {
//           setActiveNPC(id);
//           setMode("interact");
//         }}
//       />

//       <CameraManager
//         mode={mode}
//         villageRef={villageRef}
//         playerPosRef={playerPosRef}
//         scene="WORLD"
//       />
//     </>
//   );
// }

import Village from "./../environments/Village";
import Player from "./../characters/Player";
import Guide from "./../characters/Guide";
import CameraManager from "./../camera/FollowCamera";
import NPCGroup from "./NPCGroup";
import { useRef } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

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
  return (
    <>
      <Village ref={villageRef} />
        <RigidBody type="fixed" colliders={false}>
          <CuboidCollider args={[60, 0.5, 60]} position={[0, -3.5, 0]} />
          <CuboidCollider args={[1, 1.5, 1]} position={[0.74, -2.2, -0.77]} />
          <CuboidCollider args={[2.5, 1.5, 1.8]} position={[11.64, -2.2, -1.6]} />
          <CuboidCollider args={[0.5, 5, 0.5]} position={[10.03, -2.2, -5.05]} />
          <CuboidCollider args={[1.3, 1.5, 1.2]} position={[17.16, -2.2, -7.35]} />
          <CuboidCollider args={[1.5, 0.5, 1.2]} position={[19.05, -2.2, -9.42]} />
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
        spawnPosition={[-0.9, -3, -8]}
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
