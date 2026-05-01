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
  const radianes = (grados) => (grados * Math.PI) / 180;
  return (
    <>
      <Village ref={villageRef} />
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[60, 0.5, 60]} position={[0, -3.5, 0]} />
        {/* <CuboidCollider args={[1, 1.5, 1]} position={[0.74, -2.2, -0.77]} />
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
        <CuboidCollider args={[2, 2, 2]} position={[6.39, -2.2, -32.74]} /> */}

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
        <CuboidCollider args={[0.5, 10, 12]} position={[-25.67, -2, -2.8]} rotation={[0, 0.7, 0]} />
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
        <CuboidCollider args={[3, 3, 2]} position={[32.14, -1, 7.11]} />
        <CuboidCollider args={[3, 3, 1]} position={[35.93, -1, -2.71]} />
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
        {/* <CuboidCollider
          args={[0.5, 2, 5]}
          position={[30.3, -2, 1]}
          rotation={[0, radianes(-31), 0]}
        />
        <CuboidCollider args={[1, 10, 11]} position={[32.1, 0, -9.22]} />
        <CuboidCollider
          args={[0.5, 1, 20]}
          position={[22.86, -2, -29.04]}
          rotation={[0, 10, 0]}
        />
        <CuboidCollider
          args={[0.5, 10, 15]}
          position={[18.89, 0, -31.12]}
          rotation={[0, 0.8, 0]}
        />
        <CuboidCollider args={[14, 10, 1]} position={[5.18, 0, -36.76]} />
        <CuboidCollider
          args={[0.5, 1, 7.6]}
          position={[0.28, -2, -33.67]}
          rotation={[0, -0.1, 0]}
        />
        <CuboidCollider
          args={[0.5, 1, 5]}
          position={[-4, -2, -24.54]}
          rotation={[0, -1.4, 0]}
        />
        <CuboidCollider
          args={[0.5, 2, 7]}
          position={[-12.48, -2, -24.83]}
          rotation={[0, -2, 0]}
        />
        <CuboidCollider
          args={[0.5, 10, 15]}
          position={[-20, 0, -18.7]}
          rotation={[0, -0.25, 0]}
        />
        <CuboidCollider
          args={[0.5, 2, 11]}
          position={[-17.89, 0, -8.42]}
          rotation={[0, 0.6, 0]}
        />
        <CuboidCollider
          args={[0.5, 10, 8]}
          position={[-10.23, 0, 0.14]}
          rotation={[0, 0.8, 0]}
        />
        <CuboidCollider
          args={[0.5, 10, 7]}
          position={[-2.17, 0, 6.54]}
          rotation={[0, 0.8, 0]}
        />
        <CuboidCollider
          args={[0.5, 1, 19]}
          position={[10.17, -2, 7.3]}
          rotation={[0, -1.3, 0]}
        />
        <CuboidCollider
          args={[2, 2, 1.5]} // [ancho, alto, profundidad]
          position={[26.43, -2, -6.58]} // Centro de la casa
        /> */}
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
