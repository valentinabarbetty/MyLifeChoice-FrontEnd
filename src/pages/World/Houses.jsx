import AccessibleHouse from "./AccessibleHouse";
import HouseSign from "./elements/HouseSign";
import { NPCS } from "./data/npcsInfo";

function getSignPosition(housePos, offsetX = 2.5, offsetZ = 1.5) {
  return [
    housePos[0] + offsetX,
    housePos[1],
    housePos[2] + offsetZ,
  ];
}

export default function Houses({ onInteract, highlightedCareer }) {
  return (
    <>
      {Object.entries(NPCS).map(([career, npc]) => (
        <group key={career}>
          <AccessibleHouse
            position={npc.position}
            career={career}
            onInteract={onInteract}
            highlighted={highlightedCareer === career}
          />
        </group>
      ))}
    </>
  );
}