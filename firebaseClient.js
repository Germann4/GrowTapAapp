import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCP22yeFpEkY4rPDPGcSOX0hqrRLMo5gZY",
  authDomain: "growtap-gestion-nfc.firebaseapp.com",
  projectId: "growtap-gestion-nfc",
  storageBucket: "growtap-gestion-nfc.appspot.com",
  messagingSenderId: "577134056396",
  appId: "1:577134056396:web:72897375bbc497dc1dc369"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exportamos para que otros archivos los usen
export { app, auth, db };