import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCuRQsMXxuNgeLY6wZa-xnXyGcwjj5Egz4",
  authDomain: "mylifechoice-a3144.firebaseapp.com",
  projectId: "mylifechoice-a3144",
  storageBucket: "mylifechoice-a3144.firebasestorage.app",
  messagingSenderId: "125626147985",
  appId: "1:125626147985:web:8775acd68f3c85a7b40b30",
  measurementId: "G-LSP359Z10G",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
