// // // import { useFrame, useThree } from "@react-three/fiber";
// // // import { Vector3 } from "three";
// // // import { useEffect, useRef } from "react";
// // // import * as THREE from "three";

// // // export default function CameraManager({
// // //   scene,
// // //   mode,
// // //   playerPosRef,
// // //   villageRef,
// // // }) {
// // //   const { camera } = useThree();

// // //   const desiredPosition = useRef(new Vector3());
// // //   const desiredLookAt = useRef(new Vector3());

// // //   const raycaster = useRef(new THREE.Raycaster());
// // //   const hiddenMeshes = useRef(new Map());
// // //   useEffect(() => {
// // //     camera.layers.enable(1);
// // //   }, []);
// // //   useEffect(() => {
// // //     if (!playerPosRef?.current) return;

// // //     if (scene === "CAREER") {
// // //       camera.position.set(6, 4, 8);
// // //       camera.lookAt(0, 1, 0);
// // //       return;
// // //     }

// // //     if (scene === "WORLD") {
// // //       const pos = playerPosRef.current;
// // //       camera.position.set(pos.x + 6, pos.y + 6, pos.z + 10);
// // //       camera.lookAt(pos.x, pos.y + 1, pos.z);
// // //     }
// // //   }, [scene, playerPosRef, camera]);

// // //   useFrame(() => {
// // //     if (scene === "CAREER") return;
// // //     if (!playerPosRef?.current) return;

// // //     const pos = playerPosRef.current;

// // //     if (mode === "explore" || mode === "guide") {
// // //       desiredPosition.current.set(pos.x + 6, pos.y + 6, pos.z + 10);

// // //       desiredLookAt.current.set(pos.x, pos.y + 1, pos.z);
// // //     }
// // //     if (mode === "interact") return;
// // //     camera.position.lerp(desiredPosition.current, 0.08);
// // //     camera.lookAt(desiredLookAt.current);

// // //     hiddenMeshes.current.forEach((entry) => {
// // //       const { material, oldTransparent, oldOpacity } = entry;
// // //       if (!material) return;
// // //       material.transparent = oldTransparent;
// // //       material.opacity = oldOpacity;
// // //     });
// // //     hiddenMeshes.current = [];

// // //     if (!villageRef?.current) return;

// // //     const camPos = camera.position.clone();
// // //     const playerTarget = new THREE.Vector3(pos.x, pos.y + 1, pos.z);

// // //     const direction = new THREE.Vector3()
// // //       .subVectors(playerTarget, camPos)
// // //       .normalize();

// // //     const distanceToPlayer = camPos.distanceTo(playerTarget);

// // //     raycaster.current.layers.set(1);
// // //     raycaster.current.set(camPos, direction);

// // //     const intersects = raycaster.current.intersectObject(
// // //       villageRef.current,
// // //       true,
// // //     );

// // //     const blockers = intersects.filter(
// // //       (hit) =>
// // //         hit.object &&
// // //         hit.object.isMesh &&
// // //         hit.object.material &&
// // //         hit.distance > 0.3 &&
// // //         hit.distance < distanceToPlayer - 0.5,
// // //     );

// // //     blockers.forEach((hit) => {
// // //       const mesh = hit.object;

// // //       const materials = Array.isArray(mesh.material)
// // //         ? mesh.material
// // //         : [mesh.material];

// // //       materials.forEach((material) => {
// // //         if (!material || material.opacity === 0.3) return;

// // //         hiddenMeshes.current.push({
// // //           material,
// // //           oldTransparent: material.transparent,
// // //           oldOpacity: material.opacity,
// // //         });

// // //         material.transparent = true;
// // //         material.opacity = 0.3;
// // //       });
// // //     });
// // //   });

// // //   return null;
// // // }
// // import { useFrame, useThree } from "@react-three/fiber";
// // import { Vector3 } from "three";
// // import { useEffect, useRef } from "react";
// // import * as THREE from "three";

// // export default function CameraManager({
// //   scene,
// //   mode,
// //   playerPosRef,
// //   villageRef,
// // }) {
// //   const { camera } = useThree();

// //   const desiredPosition = useRef(new Vector3());
// //   const desiredLookAt = useRef(new Vector3());

// //   const raycaster = useRef(new THREE.Raycaster());
// //   const hiddenMeshes = useRef(new Map());
// //   useEffect(() => {
// //     camera.layers.enable(1);
// //   }, []);
// //   useEffect(() => {
// //     if (!playerPosRef?.current) return;

// //     if (scene === "CAREER") {
// //       camera.position.set(6, 4, 8);
// //       camera.lookAt(0, 1, 0);
// //       return;
// //     }

// //     if (scene === "WORLD") {
// //       const pos = playerPosRef.current;
// //       camera.position.set(pos.x + 6, pos.y + 6, pos.z + 10);
// //       camera.lookAt(pos.x, pos.y + 1, pos.z);
// //     }
// //   }, [scene, playerPosRef, camera]);

// //   useFrame(() => {
// //     if (scene === "CAREER") return;
// //     if (!playerPosRef?.current) return;

// //     const pos = playerPosRef.current;

// //     if (mode === "explore" || mode === "guide") {
// //       desiredPosition.current.set(pos.x + 6, pos.y + 6, pos.z + 10);

// //       desiredLookAt.current.set(pos.x, pos.y + 1, pos.z);
// //     }
// //     if (mode === "interact") return;
// //     camera.position.lerp(desiredPosition.current, 0.08);
// //     camera.lookAt(desiredLookAt.current);

// //     hiddenMeshes.current.forEach((entry) => {
// //       const { material, oldTransparent, oldOpacity } = entry;
// //       if (!material) return;
// //       material.transparent = oldTransparent;
// //       material.opacity = oldOpacity;
// //     });
// //     hiddenMeshes.current = [];

// //     if (!villageRef?.current) return;

// //     const camPos = camera.position.clone();
// //     const playerTarget = new THREE.Vector3(pos.x, pos.y + 1, pos.z);

// //     const direction = new THREE.Vector3()
// //       .subVectors(playerTarget, camPos)
// //       .normalize();

// //     const distanceToPlayer = camPos.distanceTo(playerTarget);

// //     raycaster.current.layers.set(1);
// //     raycaster.current.set(camPos, direction);

// //     const intersects = raycaster.current.intersectObject(
// //       villageRef.current,
// //       true,
// //     );

// //     const blockers = intersects.filter(
// //       (hit) =>
// //         hit.object &&
// //         hit.object.isMesh &&
// //         hit.object.material &&
// //         hit.distance > 0.3 &&
// //         hit.distance < distanceToPlayer - 0.5,
// //     );

// //     blockers.forEach((hit) => {
// //       const mesh = hit.object;

// //       const materials = Array.isArray(mesh.material)
// //         ? mesh.material
// //         : [mesh.material];

// //       materials.forEach((material) => {
// //         if (!material || material.opacity === 0.3) return;

// //         hiddenMeshes.current.push({
// //           material,
// //           oldTransparent: material.transparent,
// //           oldOpacity: material.opacity,
// //         });

// //         material.transparent = true;
// //         material.opacity = 0.3;
// //       });
// //     });
// //   });

// //   return null;
// // }
// import { useFrame, useThree } from "@react-three/fiber";
// import { Vector3 } from "three";
// import { useEffect, useRef } from "react";

// export default function CameraManager({ scene, mode, playerPos }) {
//   const { camera } = useThree();

//   const desiredPosition = useRef(new Vector3());
//   const desiredLookAt = useRef(new Vector3());

//   useEffect(() => {
//     if (scene === "CAREER") {

//       camera.position.set(6, 4, 8);
//       camera.lookAt(0, 1, 0);
//       return;
//     }

//     if (scene === "WORLD") {

//       camera.position.set(playerPos.x + 6, playerPos.y + 6, playerPos.z + 10);
//       camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);
//     }
//   }, [scene]);

//   useFrame(() => {
//     if (scene === "CAREER") return;

//     if (mode === "explore") {
//       desiredPosition.current.set(
//         playerPos.x + 6,
//         playerPos.y + 6,
//         playerPos.z + 10
//       );
//       desiredLookAt.current.set(playerPos.x, playerPos.y + 1, playerPos.z);
//     }

//     camera.position.lerp(desiredPosition.current, 0.08);
//     camera.lookAt(desiredLookAt.current);
//   });

//   return null;
// }

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CameraManager({ scene, mode, playerPos, villageRef }) {
  const { camera } = useThree();

  const desiredPosition = useRef(new Vector3());
  const desiredLookAt = useRef(new Vector3());

  const raycaster = useRef(new THREE.Raycaster());
  const hiddenMeshes = useRef([]);

  useEffect(() => {
    if (scene === "CAREER") {
      camera.position.set(6, 4, 8);
      camera.lookAt(0, 1, 0);
      return;
    }

    if (scene === "WORLD") {
      camera.position.set(playerPos.x + 6, playerPos.y + 6, playerPos.z + 10);
      camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);
    }
  }, [scene]);

  useFrame(() => {
    if (scene === "CAREER") return;

    if (mode === "explore") {
      desiredPosition.current.set(
        playerPos.x + 6,
        playerPos.y + 6,
        playerPos.z + 10,
      );

      desiredLookAt.current.set(playerPos.x, playerPos.y + 1, playerPos.z);
    }

    camera.position.set(
      desiredPosition.current.x,
      desiredPosition.current.y,
      desiredPosition.current.z,
    );

    camera.lookAt(desiredLookAt.current);
    const offset = new THREE.Vector3(6, 6, 10);

    camera.position.copy(playerPos).add(offset);
    camera.lookAt(playerPos.x, playerPos.y + 1, playerPos.z);

    hiddenMeshes.current.forEach((entry) => {
      const { material, oldTransparent, oldOpacity } = entry;
      if (!material) return;
      material.transparent = oldTransparent;
      material.opacity = oldOpacity;
    });

    hiddenMeshes.current = [];

    if (!villageRef?.current) return;

    const camPos = camera.position.clone();
    const playerTarget = new THREE.Vector3(
      playerPos.x,
      playerPos.y + 1,
      playerPos.z,
    );

    const direction = new THREE.Vector3()
      .subVectors(playerTarget, camPos)
      .normalize();

    const distanceToPlayer = camPos.distanceTo(playerTarget);

    raycaster.current.set(camPos, direction);

    const intersects = raycaster.current.intersectObject(
      villageRef.current,
      true,
    );

    const blockers = intersects.filter(
      (hit) =>
        hit.object &&
        hit.object.isMesh &&
        hit.object.material &&
        hit.distance > 0.3 &&
        hit.distance < distanceToPlayer - 0.5,
    );

    blockers.forEach((hit) => {
      const mesh = hit.object;

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((material) => {
        if (!material || material.opacity === 0.3) return;

        hiddenMeshes.current.push({
          material,
          oldTransparent: material.transparent,
          oldOpacity: material.opacity,
        });

        material.transparent = true;
        material.opacity = 0.3;
      });
    });
  });

  return null;
}
