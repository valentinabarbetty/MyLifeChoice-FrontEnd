// import { useState, useEffect } from "react";

// const STORAGE_KEY = "mlc_progress";

// const DEFAULT_STATE = {
//   visited: []
// };

// export function useUserProgress() {
//   const [progress, setProgress] = useState(DEFAULT_STATE);

//   useEffect(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       setProgress(JSON.parse(saved));
//     }
//   }, []);

//   const markVisited = (careerId) => {
//     setProgress((prev) => {
//       if (prev.visited.includes(careerId)) return prev;

//       const updated = {
//         ...prev,
//         visited: [...prev.visited, careerId]
//       };

//       localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//       return updated;
//     });
//   };

//   return {
//     visited: progress.visited,
//     markVisited
//   };
// }

import { useEffect, useState } from "react";
import { getUserProgress } from "../../../services/userService";
import { NPCS } from "../data/npcsInfo";

export function useUserProgress() {
  const [visited, setVisited] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    // 🟢 INVITADO
    if (!userId) {
      const local = JSON.parse(localStorage.getItem("mlc_progress"));
      if (local?.visited) {
        setVisited(local.visited);
      }
      return;
    }

    // 🔵 LOGUEADO
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
