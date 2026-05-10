import { useEffect, useState } from "react";
import { getUserProgress } from "../../../services/userService";
import { NPCS } from "../data/npcsInfo";

export function useUserProgress() {
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

  
    if (!userId) {
      const local = JSON.parse(localStorage.getItem("mlc_progress"));
      if (local?.visited) {
        setVisited(local.visited);
      }
      return;
    }

    getUserProgress(userId)
      .then((data) => {
        setVisited(data.visited);

        localStorage.setItem("mlc_progress", JSON.stringify(data));
      })
      .catch(() => {
        console.log("Error cargando progreso");
      });
  }, []);

  const markVisited = (career) => {
    const id = NPCS[career].id;

    setVisited((prev) => {
      const updated = [...prev, id];

      localStorage.setItem(
        "mlc_progress",
        JSON.stringify({
          visited: updated,
        }),
      );

      return updated;
    });
  };

  return { visited, markVisited };
}
