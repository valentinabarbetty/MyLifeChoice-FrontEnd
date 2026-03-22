
import { SCENE_COMPONENTS } from "../../SceneRegistry";


export default function CareerRouter({ careerId, ...props }) {
  const SceneComponent = SCENE_COMPONENTS[careerId];

  if (!SceneComponent) return null;

  return <SceneComponent {...props} />;
}