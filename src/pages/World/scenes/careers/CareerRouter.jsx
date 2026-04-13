import { Physics } from "@react-three/rapier";
import { SCENE_COMPONENTS } from "../../SceneRegistry";
import { useState } from "react";

export default function CareerRouter({ careerId, ...props }) {
  const SceneComponent = SCENE_COMPONENTS[careerId];

  if (!SceneComponent) return null;

  return (
    <Physics>
      <SceneComponent {...props}
     />
    </Physics>
  );
}
