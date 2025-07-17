import express from 'express';
import cors from 'cors';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const app = express();
const port = 3000;

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCP22yeFpEkY4rPDPGcSOX0hqrRLMo5gZY",
  authDomain: "growtap-gestion-nfc.firebaseapp.com",
  projectId: "growtap-gestion-nfc",
  storageBucket: "growtap-gestion-nfc.firebasestorage.app",
  messagingSenderId: "577134056396",
  appId: "1:577134056396:web:72897375bbc497dc1dc369"
};

// Inicializar Firebase y Firestore
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// Middleware para leer JSON en peticiones
app.use(express.json());

// Middleware CORS — permite frontend en estos orígenes
const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // permite Postman, curl, etc.
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `La política CORS no permite el acceso desde el origen ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Ruta para guardar cliente
app.post('/api/clientes', async (req, res) => {
  const { nombre, email, estado } = req.body;

  if (!nombre || !email || !estado) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const docRef = await addDoc(collection(db, "clientes"), {
      nombre,
      email,
      estado,
      creadoEn: new Date()
    });

    res.status(201).json({ message: 'Cliente guardado', id: docRef.id });
  } catch (error) {
    console.error("Error guardando cliente:", error);
    res.status(500).json({ error: 'Error guardando cliente' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});