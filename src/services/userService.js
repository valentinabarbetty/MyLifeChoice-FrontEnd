import { API_URL } from "./api";


export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    console.log("🔐 Login exitoso:", data);
    return data;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};

export const checkUserProgress = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/exploration/has_progress/${userId}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }
    const data = await response.json();
    console.log("Progreso del usuario:", data);
    return data;
  } catch (error) {
    console.error("Error al verificar el progreso del usuario:", error);
    throw error;
  }
};

export const addGuide = async (email, guide_id) => {
  try {
    const response = await fetch(`${API_URL}/users/assign_guide_by_email/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, guide_id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Guía asignada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al asignar guía:", error);
    throw error;
  }
};


export const addPlayer = async (email, player_type_id) => {
  try {
    const response = await fetch(`${API_URL}/users/assign_player_type/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, player_type_id }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Player añadido exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al añadir player:", error);
    throw error;
  }
};

export const googleLogin = async (email, name) => {
  try {
    const response = await fetch(`${API_URL}/users/google_login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Login con Google exitoso:", data);
    return data;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);
    throw error;
  }
};

export const updateNickname = async (email, nickname) => {
  try {
    const response = await fetch(`${API_URL}/users/update_nickname/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nickname }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Nickname actualizado correctamente:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar nickname:", error);
    throw error;
  }
};

export const getUserProgress = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/exploration/progress/${userId}/`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    throw error;
  }
};

export const saveProgress = async (progressData) => {
  try {
    const response = await fetch(`${API_URL}/exploration/progress/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Progreso guardado:", data);
    return data;

  } catch (error) {
    console.error("❌ Error al guardar progreso:", error);
    throw error;
  }
};

export const checkIntroStatus = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/check-intro/${userId}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    console.log("🧠 Estado de intro:", data);
      if (data.has_intro) {
      localStorage.setItem("intro_done", "true");
    } else {
      localStorage.removeItem("intro_done");
    }
    return data;

  } catch (error) {
    console.error("❌ Error al verificar intro:", error);
    throw error;
  }
};

export const completeIntro = async (userId, guideId) => {
  try {
    const response = await fetch(`${API_URL}/users/complete-intro/${userId}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guide_id: guideId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;

  } catch (error) {
    console.error("Error al completar intro:", error);
    throw error;
  }
};