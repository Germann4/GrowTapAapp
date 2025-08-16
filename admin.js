import { createDashboardChart, createStatsChart, createClientDistributionChart } from './adminScansChart.js';

  /* Obtenemos el contexto del canvas con id scansChart para el gráfico del Dashboard */
  const ctx = document.getElementById('scansChart').getContext('2d');
  createDashboardChart(ctx);
  /* Obtenemos el contexto del canvas con id 'trendChart' para el gráfico de Estadísticas */
  const ctxs = document.getElementById('trendChart').getContext('2d'); 
  createStatsChart(ctxs) 
  /* Obtenemos el contexto del canvas con id clientDistributionChart para crear el gráfico de rosquita (30% verde, 70% violeta) */
  const ctx3 = document.getElementById('clientDistributionChart').getContext('2d');
  createClientDistributionChart(ctx3);
  

  /* Mostrar solo la sección Dashboard y ocultar las demás */
  document.querySelector('.dashboard').addEventListener('click', (e) =>{
    console.log('dashboard')
     document.querySelector('#dashboard').classList.remove('hidden');
     document.querySelector('#clients').classList.add('hidden');  
     document.querySelector('#products').classList.add('hidden');
     document.querySelector('.analytics').classList.add('hidden');
  });
  /* Mostrar solo la sección Clientes y ocultar las demás */
  document.querySelector('.clients').addEventListener('click', (e) =>{
     console.log('Clientes')
     document.querySelector('#dashboard').classList.add('hidden');  
     document.querySelector('#clients').classList.remove('hidden');
     document.querySelector('#products').classList.add('hidden');
     document.querySelector('.analytics').classList.add('hidden');
  });
  /* Mostrar solo la sección Productos y ocultar las demás */
  document.querySelector('.products').addEventListener('click', (e) => {
      console.log('products')
      document.querySelector('#dashboard').classList.add('hidden');
      document.querySelector('#clients').classList.add('hidden');
      document.querySelector('.analytics').classList.add('hidden');
      document.querySelector('#products').classList.remove('hidden');
  });
  /* Mostrar solo la sección Estadísticas y ocultar las demás */ 
  document.querySelector('.statistics').addEventListener('click', () => {
      document.querySelector('#dashboard').classList.add('hidden');
      document.querySelector('#clients').classList.add('hidden');  
      document.querySelector('#products').classList.add('hidden');
      document.querySelector('.analytics').classList.remove('hidden');
  });
  /* Cerrar Modal productos Importar CSV */
  document.querySelector('.close-modal').addEventListener('click', () => {
      document.querySelector('#importModal').classList.remove('active'); 
  });
  /* Abrir Modal productos Importar CSV */
  document.querySelector('#importProductsBtn').addEventListener('click', () => {
      document.querySelector('#importModal').classList.add('active'); 
  });
  /* Abrir Modal Nuevo Producto */
  document.querySelector('#addProductBtn').addEventListener('click', () => {
      document.querySelector('#productModal').classList.add('active'); 
  });
  /* Cerrar Modal Nuevo Producto */
  document.querySelector('.close-new-product-modal').addEventListener('click', () => {
      document.querySelector('#productModal').classList.remove('active'); 
      document.getElementById('productModalEdit').classList.remove('active')
  });
  /* Abrir Modal Nuevo Cliente */
  document.querySelector('#addClientBtn').addEventListener('click', () => {
      document.querySelector('#clientModal').classList.add('active');
  });
  /* Cerrar Modal Nuevo Cliente */
  document.querySelector('.close-new-customer-modal').addEventListener('click', () => {
      document.querySelector('#clientModal').classList.remove('active');
  });
   /* Cerrar Modal Editar Cliente */
  document.querySelector('.CloseEditClientModal').addEventListener('click', () => {
      document.querySelector('.ClientEdit').classList.remove('active');
  });
  /* Abrir Modal Editar Producto */
  
  /*Cerrar Modal Editar Producto */
  document.querySelector('.Close-product-modal').addEventListener('click', () => {
      document.querySelector('#productModal').classList.remove('active');
  });
 
   
/* Redirección al login con botón de cerrar sesión  */
  document.querySelector('#logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'http://127.0.0.1:5500/login.html'
  });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Redirige al login si no está autenticado
    window.location.href = 'http://127.0.0.1:5500/login.html'
    console.log('Usuario no logueado')
  } else {
    console.log("Usuario logueado:", user.email);
  }
});

const form = document.getElementById('clientForm');
/* Enviar nuevo cliente al backend creado por el administrador */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const estado = document.getElementById('clientStatus').value;

  try {
    // Enviar datos al backend (tu servidor express)
    const res = await fetch('http://localhost:3000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, estado })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Cliente creado correctamente. Se ha enviado un correo para crear la contraseña.');
      form.reset();

      // Luego de crear, actualizar lista de usuarios en consola
      await listarUsuarios();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error(error);
    alert('Hubo un problema al conectar con el servidor.');
  }
});

// Obtiene los usuarios desde Firebase, los muestra en la tabla 
async function listarUsuarios() {
  try {
    const usuariosCol = collection(db, "usuarios");
    const snapshot = await getDocs(usuariosCol);
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    document.querySelector('#clientsTableBody').innerHTML = '';

    usuarios.forEach(element => {
      if (!element.email) return;
      let option = document.createElement('option');
      document.getElementById('productClient').appendChild(option);
      option.textContent = `${element.nombre}`;
      option.value = `${element.id}`;

      document.querySelector('#clientsTableBody').innerHTML += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span class="text-indigo-600 font-medium">${element.PrimeraLetraDelNombre}</span>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${element.nombre}</div>
                <div class="text-sm text-gray-500">ID: 2</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${element.email}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="badge badge-success">Activo</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 mr-3" data-id="${element.id}">
              <i class="fas fa-edit" data-id="${element.id}"></i>
            </button>
            <button class="text-red-600 hover:text-red-900" data-id="${element.id}">
              <i class="fas fa-trash" data-id="${element.id}"></i>
            </button>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Error leyendo usuarios de Firestore:", error);
  }
}
// Llamás a la función para que se ejecute
listarUsuarios();
 
document.getElementById('productClient').addEventListener('change', (e) => {
  const selectedValue = e.target.value;
  const selectedText = e.target.options[e.target.selectedIndex].text;

  console.log("Cliente seleccionado:", selectedText);
});
document.getElementById('productEdit').addEventListener('change', (e) => {
  const selectedValue = e.target.value;
  const selectedText = e.target.options[e.target.selectedIndex].text;

  console.log("Cliente seleccionado:", selectedText);
});

const formProduc = document.getElementById('productForm');  

// Obtiene los productos desde Firebase, los muestra en la tabla
async function listarProductos() {
  try {
    const productosCol = collection(db, "productos");
    const snapshot = await getDocs(productosCol);

    const productos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const tbody = document.getElementById('productsTableBody');
    const productClientFilter = document.getElementById('productClientFilter');
    const productEdit = document.getElementById('productEdit');

    // Limpiar antes de agregar
    tbody.innerHTML = '';
    productClientFilter.innerHTML = '';
    productEdit.innerHTML = '';

    // Opcional: opción por defecto
    const defaultOption1 = document.createElement('option');
    defaultOption1.textContent = 'Seleccionar cliente';
    defaultOption1.value = '';
    productClientFilter.appendChild(defaultOption1);

    const defaultOption2 = document.createElement('option');
    defaultOption2.textContent = 'Seleccionar cliente';
    defaultOption2.value = '';
    productEdit.appendChild(defaultOption2);

    // Recorremos productos
    productos.forEach(element => {
      // Agregar opciones
      const option1 = document.createElement('option');
      option1.textContent = `${element.clienteNombre}`;
      option1.value = `${element.clienteId}`;
      productClientFilter.appendChild(option1);

      const option2 = document.createElement('option');
      option2.textContent = `${element.clienteNombre}`;
      option2.value = `${element.clienteId}`;
      productEdit.appendChild(option2);

      // Agregar fila a la tabla
      tbody.innerHTML += `
        <tr>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <i class="fas fa-qrcode text-green-600"></i>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">${element.codigo}</div>
                <div class="text-sm text-gray-500">ID: ${element.id}</div>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">${element.url}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${element.clienteNombre}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="badge badge-success">Activo</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button class="Edit-Product-Btn text-indigo-600 hover:text-indigo-900 mr-3" data-id="${element.id}">
              <i class="fas fa-edit EditProduct" data-id="${element.id}"></i>
            </button>
            <button class="text-red-600 hover:text-red-900" data-id="${element.id}">
              <i class="fas fa-trash trashEditProduct" data-id="${element.id}"></i>
            </button>
          </td>
        </tr>
      `;
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}


listarProductos();


formProduc.addEventListener('submit', async (e) => {
  e.preventDefault();

  const productClient = document.getElementById('productClient');
  const clienteId = productClient.value; // ESTE es el UID del usuario (importante)
  const clienteNombre = productClient.options[productClient.selectedIndex].text;
  const productCode = document.getElementById('productCode').value.trim();
  const productUrl = document.getElementById('productUrl').value.trim();

  try {
    const res = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteId,        // ahora se envía el ID
        clienteNombre,    // opcional, por si querés mostrarlo después
        productCode,
        productUrl
      }),
    });

    const data = await res.json();
    await listarProductos();
    
    if (data.recibido) {
      document.querySelector('.modal').classList.remove('active');
      console.log(data);
    }

  } catch (error) {
    console.error("Error enviando producto:", error);
  }
});

let productId 
// EDITAR USUARIO y PRODUCTOS - mostrar datos en el form
document.addEventListener('click', async (e) => {
  // EDITAR USUARIO
  if (e.target.className === 'fas fa-edit') {
    const userId = e.target.getAttribute('data-id');

    // Obtener usuarios desde Firestore
    const usuariosCol = collection(db, "usuarios");
    const snapshot = await getDocs(usuariosCol);
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const usuarioAEditar = usuarios.find(u => u.id === userId);
     
    if (usuarioAEditar) {
      document.getElementById('clientNameEdit').value = usuarioAEditar.nombre;
      document.getElementById('clientEmailEdit').value = usuarioAEditar.email;
      document.getElementById('clientStatus').value = usuarioAEditar.estado || 'active';

      document.getElementById('clientFormEdit').setAttribute('data-user-id', userId);
      document.querySelector('.ClientEdit').classList.add('active');
    } else {
      console.error('Usuario no encontrado con ese ID');
    }
  }

  // EDITAR PRODUCTO
  const productBtn = e.target.closest('.EditProduct');
if (productBtn) {
  const productoId = productBtn.getAttribute('data-id');
  console.log('ID capturado:', productoId);

  const productosCol = collection(db, "productos");
  const snapshot = await getDocs(productosCol);
  const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const productoAEditar = productos.find(p => p.id === productoId);

  if (!productoAEditar) {
    console.error('Producto no encontrado con ese ID');
    return;
  }

  document.getElementById('productCodeEdit').value = productoAEditar.codigo;
  document.getElementById('productUrlEdit').value = productoAEditar.url;

  const select = document.getElementById('productEdit');
  const nombreBuscado = productoAEditar.clienteNombre;

  for (let option of select.options) {
    if (option.text === nombreBuscado) {
      option.selected = true;
      break;
    }
  }

  document.getElementById('productStatusEdit').value = productoAEditar.estado || 'active';

  // Setear el ID en el formulario de edición
  document.getElementById('productFormEdit').setAttribute('data-product-id', productoId);

  document.getElementById('productModalEdit').classList.add('active');
}
});

// EDITAR USUARIO - submit del formulario
document.getElementById('clientFormEdit').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  form.getAttribute('data-user-id')
  console.log(e.target)
  
  const userId = form.getAttribute('data-user-id');
  const nombre = document.getElementById('clientNameEdit').value.trim();
  const email = document.getElementById('clientEmailEdit').value.trim();
  const estado = document.getElementById('clientStatus').value;

  if (!userId || !nombre || !email) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/editar-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, nombre, email, estado })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Usuario actualizado correctamente.');
      form.classList.remove('active');
      await listarUsuarios(); // Refrescar la lista
    } else {
      alert('Error al actualizar usuario: ' + data.error);
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    alert('Ocurrió un error. Revisá la consola.');
  }
});
// Editar Producto
document.getElementById('productFormEdit').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(e.target.getAttribute('data-product-id')) 
  // Obtener valores del formulario
  const codigo = document.getElementById('productCodeEdit').value.trim();
  const url = document.getElementById('productUrlEdit').value.trim();
  const productoId = e.target.getAttribute('data-product-id')
  const estado = document.getElementById('productStatusEdit').value;

  // Validar campos obligatorios
  if (!codigo || !url) {
    alert('Por favor completa todos los campos obligatorios.');
    return;
  }

  // Aquí asumimos que tenés la variable productId que identifica qué producto editar,
  // por ejemplo, la pasás desde un dataset o una variable global

  try {
    const res = await fetch('http://localhost:3000/api/editar-productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productoId,
        codigo,
        url,
        estado
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    alert('Producto actualizado correctamente.');

    await listarProductos();
    // Acá podrías cerrar modal, refrescar lista, etc.

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    alert('Ocurrió un error. Revisá la consola.');
  }
});
document.addEventListener('click', async (e) => {
  const target = e.target;

  // Eliminar producto
  const trashBtn = target.closest('.trashEditProduct');
  if (trashBtn) {
    const id = trashBtn.getAttribute('data-id');
    if (!id) return;
    
    // Confirmación antes de eliminar
    alert('¿Estás seguro de que querés eliminar este producto?');
    
    try {
      const res = await fetch('http://localhost:3000/api/eliminar-productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      

      const data = await res.json();
      console.log('Producto eliminado:', data);

      await listarProductos();

    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }

    return; // No seguir evaluando otros clics
  }

  // Editar producto
  const editBtn = target.closest('.EditProduct');
  if (editBtn) {
    const id = editBtn.getAttribute('data-id');
    console.log('Editar producto ID:', id);
    return;
  }

  // Eliminar usuario
  const userDeleteBtn = target.closest('button.text-red-600');
  if (userDeleteBtn) {
    // Evitar conflicto si es el botón de eliminar producto
    if (target.closest('.trashEditProduct')) return;

    const uid = userDeleteBtn.getAttribute('data-id');
    if (!confirm('¿Estás seguro de que querés eliminar este usuario?')) return;

    try {
      const res = await fetch('http://localhost:3000/api/eliminar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Usuario eliminado correctamente.');
        await listarUsuarios();
      } else {
        alert('Error al eliminar usuario: ' + data.error);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }

    return;
  }
});


