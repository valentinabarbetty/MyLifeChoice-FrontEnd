import ClassificationGame from "../../../ui/ClassificationGame/ClassificationGame";

import workout1 from "../../../../../../public/assets/ui/EducacionFisica/workout1.png";
import workout2 from "../../../../../../public/assets/ui/EducacionFisica/workout2.png";
import workout3 from "../../../../../../public/assets/ui/EducacionFisica/workout3.png";
import workout4 from "../../../../../../public/assets/ui/EducacionFisica/workout4.png";
import workout5 from "../../../../../../public/assets/ui/EducacionFisica/workout5.png";
import workout6 from "../../../../../../public/assets/ui/EducacionFisica/workout6.png";

const EXERCISES = [
  { id: 1, name: "Sentadilla", image: workout1, correct: "piernas" },
  { id: 2, name: "Remo en poléa", image: workout2, correct: "espalda" },
  { id: 3, name: "Prensa", image: workout3, correct: "piernas" },
  { id: 4, name: "Abdominales", image: workout4, correct: "core" },
  { id: 5, name: "Curl Bícep", image: workout5, correct: "biceps" },
  { id: 6, name: "Dominadas", image: workout6, correct: "espalda" },
];

const CATEGORIES = [
  { id: "biceps", label: "Bíceps", emoji: "💪" },
  { id: "piernas", label: "Piernas", emoji: "🦵" },
  { id: "core", label: "Abdomen", emoji: "🔥" },
  { id: "espalda", label: "Espalda", emoji: "🏋️‍♂️" },
];

export default function EducacionFisicaGame({ onComplete }) {
  return (
    <ClassificationGame
      title="🏃 Clasifica los ejercicios"
      subtitle="Arrastra cada ejercicio al grupo muscular correcto"
      itemsData={EXERCISES}
      categories={CATEGORIES}
      onComplete={onComplete}
      renderItem={(item) => (
        <>
          <img src={item.image} alt={item.name} />
          <p>{item.name}</p>
        </>
      )}
    />
  );
}