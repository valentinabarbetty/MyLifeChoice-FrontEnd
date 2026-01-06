import Scene3D from "../IntroFlow/components/Scene3D/Scene3D";

export default function World() {
  const guideId = Number(localStorage.getItem("guideId"));
  const playerName = localStorage.getItem("playerName");

  return (
    <>
      <Scene3D guideId={guideId} showArrows={dialogueIndex === 7}
          animationState={animationState} />
      
    </>
  );
}
