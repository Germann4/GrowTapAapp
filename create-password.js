import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAuth, updatePassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
  import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

  const form = document.getElementById("changePassForm");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("No hay usuario autenticado. Volvé a iniciar sesión.");
      window.location.href = "http://127.0.0.1:5500/login.html";
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("newPassword").value;

      try {
        await updatePassword(user, newPassword);
        const userRef = doc(db, "usuarios", user.uid);
        await updateDoc(userRef, { requiereCambioPassword: false });

        alert("Contraseña actualizada correctamente. Iniciá sesión con tu nueva contraseña.");
        await signOut(auth);
        window.location.href = "http://127.0.0.1:5500/login.html";
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Hubo un error. Asegurate de que la contraseña sea segura y que la sesión siga activa.");
      }
    });
  });