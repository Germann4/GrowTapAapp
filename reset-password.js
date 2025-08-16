// Importamos las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Configuración de Firebase con tus credenciales del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyCP22yeFpEkY4rPDPGcSOX0hqrRLMo5gZY",
  authDomain: "growtap-gestion-nfc.firebaseapp.com",
  projectId: "growtap-gestion-nfc",
  storageBucket: "growtap-gestion-nfc.appspot.com",
  messagingSenderId: "577134056396",
  appId: "1:577134056396:web:72897375bbc497dc1dc369"
};

// Inicializamos la app de Firebase con la configuración
const app = initializeApp(firebaseConfig);
// Obtenemos la instancia del servicio de autenticación
const auth = getAuth(app);

// Esperamos que el DOM cargue para asegurar que los elementos existan
window.addEventListener('DOMContentLoaded', () => {
  // Obtenemos el formulario de cambio de contraseña
  const form = document.getElementById("changePassForm");

  // Verificamos si hay un usuario autenticado
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Si no hay usuario logueado, mostramos alerta y redirigimos a login
      alert("No estás autenticado. Por favor inicia sesión.");
      window.location.href = "login.html";
      return;
    }
    
    // Si hay usuario autenticado, configuramos el evento submit del formulario
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // Evitamos que el formulario se envíe por defecto y recargue la página

      // Obtenemos las contraseñas ingresadas por el usuario
      const currentPassword = document.getElementById("currentPassword").value.trim();
      const newPassword = document.getElementById("newPassword").value.trim();

      // Validamos que haya ingresado la contraseña actual
      if (!currentPassword) {
        alert("Debes ingresar la contraseña actual.");
        return;
      }

      // Validamos que la nueva contraseña tenga al menos 6 caracteres
      if (newPassword.length < 6) {
        alert("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }

      // Creamos una credencial con el email del usuario y la contraseña actual para reautenticarlo
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      try {
        // Reautenticamos al usuario con la credencial (es obligatorio para cambiar contraseña)
        await reauthenticateWithCredential(user, credential);
        // Actualizamos la contraseña con la nueva proporcionada
        await updatePassword(user, newPassword);

        // Informamos al usuario que el cambio fue exitoso
        alert("Contraseña cambiada con éxito. Ahora inicia sesión con la nueva contraseña.");
        form.reset(); // Limpiamos el formulario

        // Cerramos sesión para que el usuario vuelva a ingresar con la nueva contraseña
        await auth.signOut();
        // Redirigimos al login
        window.location.href = "login.html";

      } catch (error) {
        // En caso de error mostramos el error en consola y alertamos al usuario
        console.error("Error durante el cambio de contraseña:", error);
        alert("Error al cambiar la contraseña. Revisa la contraseña actual o la nueva y vuelve a intentar.");
      }
    });
  });
});