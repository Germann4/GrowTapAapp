const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const axios = require('axios');
const dotenv = require('dotenv');

// Esta es la línea que debes corregir para que funcione.
const serviceAccount = require('./clave-privada.json');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
app.use(cors());
app.use(express.json());

function generarPasswordTemp() {
  return Math.random().toString(36).slice(-10);
}
// Crear usuario desde el administrador
app.post('/api/clientes', async (req, res) => {
  const { nombre, email, estado } = req.body;
  const PrimeraLetraDelNombre = nombre.charAt(0).toUpperCase();

  if (!email || !nombre || !estado) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    let userRecord;
    const tempPassword = generarPasswordTemp();

    try {
      // Intentar obtener usuario existente
      userRecord = await admin.auth().getUserByEmail(email);

      // Si existe, actualizar solo el campo requiereCambioPassword en Firestore
      await db.collection('usuarios').doc(userRecord.uid).set({
       nombre,
       PrimeraLetraDelNombre,
       email,
       estado,
       perfil: 'cliente',
       creadoEn: admin.firestore.FieldValue.serverTimestamp(),
       requiereCambioPassword: true
}, { merge: true });

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Si no existe, crear usuario nuevo
        userRecord = await admin.auth().createUser({
          email,
          password: tempPassword,
          disabled: estado.toLowerCase() !== 'activo'
        });

        // Guardar datos completos en Firestore
        await db.collection('usuarios').doc(userRecord.uid).set({
          nombre,
          PrimeraLetraDelNombre,
          email,
          estado,
          perfil: 'cliente',
          creadoEn: admin.firestore.FieldValue.serverTimestamp(),
          requiereCambioPassword: true
        });
      } else {
        throw error;
      }
    }

    // Enviar email con Brevo
    await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: {
        name: "GrowTap",
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: [{ email }],
      subject: "Tu contraseña temporal",
      htmlContent: `
        <p>Hola ${nombre},</p>
        <p>Tu contraseña temporal es: <strong>${tempPassword}</strong></p>
        <p>Iniciá sesión aquí: <a href="http://127.0.0.1:5500/login.html">Login</a></p>
        <p>Luego podrás cambiarla por una definitiva.</p>
      `
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({ message: 'Usuario creado y datos guardados en Firestore' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario o enviar correo' });
  }
});

// Eliminar Usuarios desde el Administrador
app.post('/api/eliminar-usuario', async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: 'UID no proporcionado.' });
  }

  try {
    // Eliminar de Authentication
    await admin.auth().deleteUser(uid);

    // Eliminar documento en Firestore
    await admin.firestore().collection('usuarios').doc(uid).delete();

    return res.status(200).json({ message: 'Usuario eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ error: 'Error al eliminar usuario.' });
  }
});
// Editar Usuarios desde el Administrador
app.post('/api/editar-usuario', async (req, res) => {
  const { userId, nombre, email, estado } = req.body;

  if (!userId || !nombre || !email || !estado) {
    return res.status(400).json({ error: 'Faltan datos requeridos.' });
  }

  try {
    // Actualizar el email en Firebase Authentication (si es necesario)
    await admin.auth().updateUser(userId, { email });

    // Actualizar los datos en Firestore
    await admin.firestore().collection('usuarios').doc(userId).update({
      nombre,
      email,
      estado
    });

    res.status(200).json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error interno al actualizar usuario.' });
  }
});
app.post('/api/productos', async (req, res) => {
  const { clienteId, productCode, productUrl, clienteNombre } = req.body;

  // Validaciones básicas
  if (!clienteId || !productCode || !productUrl) {
    return res.status(400).json({ recibido: false, error: 'Faltan datos obligatorios' });
  }

  try {
    // Verificar que el usuario existe en la colección 'usuarios'
    const userDoc = await db.collection('usuarios').doc(clienteId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ recibido: false, error: 'Cliente no encontrado' });
    }

    // Crear nuevo producto en Firestore con referencia al cliente
    await db.collection('productos').add({
      clienteId,
      clienteNombre: clienteNombre || null, // opcional, por si lo necesitás mostrar
      codigo: productCode,
      url: productUrl,
      creadoEn: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      recibido: true,
      mensaje: 'Producto guardado correctamente',
    });

  } catch (error) {
    console.error('Error guardando producto:', error);
    res.status(500).json({
      recibido: false,
      error: 'Error interno del servidor',
    });
  }
});
app.post('/api/editar-productos', async (req, res) => {
  try {
    const { productoId, codigo, url, estado } = req.body;
    console.log(productoId)
    if (!productoId || !codigo || !url) {
      return res.status(400).send('Faltan datos obligatorios');
    }

    const productoRef = db.collection('productos').doc(productoId);

    await productoRef.update({
      codigo,
      url,
      estado,
      modificadoEn: new Date()
    });

    res.status(200).send('Producto actualizado correctamente');
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});
app.post('/api/eliminar-productos', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Falta el ID del producto' });
  }

  try {
    await db.collection('productos').doc(id).delete();
    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }  
});
app.post('/api/clientEditar-productos', async (req, res) => {
  try {
    const { productoId, codigo, url } = req.body;
    console.log(productoId)  
    if (!productoId || !codigo || !url) {
      return res.status(400).send('Faltan datos obligatorios');
    }
  
    const ClienteproductoRef = db.collection('productos').doc(productoId);

    await ClienteproductoRef.update({
      codigo,
      url,
      modificadoEn: new Date()
    });

    res.status(200).send('Producto actualizado correctamente');
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});