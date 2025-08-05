import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCP22yeFpEkY4rPDPGcSOX0hqrRLMo5gZY",
  authDomain: "growtap-gestion-nfc.firebaseapp.com",
  projectId: "growtap-gestion-nfc",
  storageBucket: "growtap-gestion-nfc.appspot.com",
  messagingSenderId: "577134056396",
  appId: "1:577134056396:web:72897375bbc497dc1dc369"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Autenticado como:", user.email);

    // Obtener datos del usuario directamente sin esperar el onAuthStateChanged
    const userDocRef = doc(db, "usuarios", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      console.log("Datos de usuario:", userData);
      
      console.log("requiereCambioPassword:", userData.requiereCambioPassword);
      // Verificar si debe cambiar la contraseña
      if (userData.requiereCambioPassword === true) {
        alert("Necesitás crear una nueva contraseña antes de continuar.");
        window.location.href = 'http://127.0.0.1:5500/create-password.html';
        return; // Detenemos el resto de la ejecución
      }

      alert(`Bienvenido ${userData.nombre} (${user.email})`);

      if (userData.perfil === 'cliente') {
        window.location.href = 'http://127.0.0.1:5500/client.html';
      } else if (userData.perfil === 'admin') {
        window.location.href = 'http://127.0.0.1:5500/admin.html';
      }

    } else {
      alert("El usuario no tiene datos en Firestore.");
      console.warn("No hay documento para este UID en 'usuarios'.");
    }

  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error("Error de login:", error);
  }
});
