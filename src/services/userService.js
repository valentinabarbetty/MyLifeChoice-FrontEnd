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

export const googleLogin = async (token) => {
  try {
    const response = await fetch(`${API_URL}/users/google_login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));

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
