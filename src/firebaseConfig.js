// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuRQsMXxuNgeLY6wZa-xnXyGcwjj5Egz4",
  authDomain: "mylifechoice-a3144.firebaseapp.com",
  projectId: "mylifechoice-a3144",
  storageBucket: "mylifechoice-a3144.firebasestorage.app",
  messagingSenderId: "125626147985",
  appId: "1:125626147985:web:8775acd68f3c85a7b40b30",
  measurementId: "G-LSP359Z10G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Inicializa el servicio de autenticación
const auth = getAuth(app);

// ✅ Crea el proveedor de Google
const provider = new GoogleAuthProvider();

// Exporta para usar en tu componente
export { auth, provider };
