import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCP22yeFpEkY4rPDPGcSOX0hqrRLMo5gZY",
  authDomain: "growtap-gestion-nfc.firebaseapp.com",
  projectId: "growtap-gestion-nfc",
  storageBucket: "growtap-gestion-nfc.firebasestorage.app",
  messagingSenderId: "577134056396",
  appId: "1:577134056396:web:72897375bbc497dc1dc369"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Escuchar el submit del formulario
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    document.getElementById('loginSpinner').style.display = 'inline-block';

    // Login con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Mostrar mensaje DESPUÉS del login exitoso
    alert(`Bienvenido ${user.email}`);
    window.location.href = 'http://127.0.0.1:5500/admin.html'
    console.log(user.email);

    // window.location.href = 'dashboard.html'; // redirección opcional

  } catch (error) {
    alert(`Error: ${error.message}`);
    console.error(error);
  } finally {
    document.getElementById('loginSpinner').style.display = 'none';
  }
});