import { createClientChart, renderClientScanEvolutionChart, createProductRoscaChart, renderHourlyActivityChart } from './clientScansChart.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { auth, db } from './firebaseClient.js';
import { getFirestore, doc, getDoc , collection, getDocs } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

/* Importamos la función que crea el gráfico de escaneos del cliente */
const ctx = document.getElementById('myScansChart').getContext('2d');
createClientChart(ctx);
/* Sección: Mis Estadísticas - Evolución de Escaneos */
const ctxs = document.getElementById('myTrendChart').getContext('2d');
renderClientScanEvolutionChart(ctxs);
/* Contexto del canvas para el gráfico de dona (distribución por producto) */
const ctx3 = document.getElementById('myProductDistributionChart').getContext('2d');
createProductRoscaChart(ctx3);
/* Esperamos a que el DOM esté cargado para obtener el canvas de actividad horaria y luego renderizar el gráfico de barras con los datos de escaneos por hora. */
document.addEventListener('DOMContentLoaded', () => {
  const ctxHourlyActivity = document.getElementById('hourlyChart')?.getContext('2d');

  if (ctxHourlyActivity) {
    const hourlyData = [1, 0, 0, 2, 1, 4, 6, 5, 3, 2, 1, 0, 0, 1, 2, 3, 2, 4, 5, 3, 1, 0, 0, 1];
    renderHourlyActivityChart(ctxHourlyActivity, hourlyData);
  }
});

/* Mostrar solo la sección Mi Dashboard y ocultar las demás */
document.querySelector('.my-dashboard').addEventListener('click', () => {
   document.querySelector('#client-dashboard').classList.remove('hidden');
   document.querySelector('#client-products').classList.add('hidden');
   document.querySelector('#client-analytics').classList.add('hidden');
});
/* Mostrar solo la sección Mis Productos y ocultar las demás */
document.querySelector('.my-products').addEventListener('click', () => {
   console.log('my-products')
   document.querySelector('#client-dashboard').classList.add('hidden');
   document.querySelector('#client-products').classList.remove('hidden');
   document.querySelector('#client-analytics').classList.add('hidden');
});
/* Mostrar solo la sección Mis Estadísticas y ocultar las demás */
document.querySelector('.my-statistics').addEventListener('click', () => {
    document.querySelector('#client-dashboard').classList.add('hidden');
    document.querySelector('#client-products').classList.add('hidden');
    document.querySelector('#client-analytics').classList.remove('hidden');
});
/* Mostrar o ocultar Notificacion */
/*
document.querySelector('.copy-url-button').addEventListener('click', () => {
    document.querySelector('#notification').classList.add('show');
    setTimeout(() => {
        document.querySelector('#notification').classList.remove('show');
    }, 3000);
});
*/


// Función para cargar productos de Firestore filtrando por usuario (email)

// Control de autenticación
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // Redirigir al login si no está autenticado
    window.location.href = 'http://127.0.0.1:5500/login.html';
    console.log('Usuario no logueado');
  } else {
    console.log("Usuario logueado:", user.email);
    // Cargar los productos del usuario logueado
    listarProductos();
  }
});

// Evento para cerrar sesión
document.querySelector('#logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'http://127.0.0.1:5500/login.html';
  });
});
/**
 * Lista y muestra en la tabla los productos del usuario autenticado,
 * obteniéndolos desde Firestore y filtrando por su clienteId.
*/
const tbody = document.getElementById("myProductsTableBody");
async function listarProductos() {
  try {
    const productosCol = collection(db, "productos");
    const snapshot = await getDocs(productosCol);

    const productos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const userId = auth.currentUser?.uid;
    console.log(userId,productos)
   
    
    // Filtrar productos del usuario actual
    const productosDelUsuario = productos.filter(producto => producto.clienteId === userId);
    document.getElementById('myProducts').textContent = productosDelUsuario.length;
    
    console.log("UID:", userId);
    console.log("Productos del usuario:", productosDelUsuario);

   const userDocRef = doc(db, "usuarios", userId);
   const userDocSnap = await getDoc(userDocRef);

   if (userDocSnap.exists()) {
   const userData = userDocSnap.data();
   console.log(userData.estado)
   console.log("Datos del usuario:", userData);
   if (userData.estado === "active") {
    console.log("Usuario activo",productosDelUsuario.length);
    document.getElementById('myActiveProducts').textContent = productosDelUsuario.length;

  } else {
    console.log("Usuario inactivo");
  }
   } else {
    console.warn("El documento del usuario no existe en Firestore");
}
 
let ejecutado = false;
  
  console.log(document.getElementById('productSummary'))  
  // Limpiar
  tbody.innerHTML = '';
  document.getElementById('myTopProducts').innerHTML = '';
  document.getElementById('productSummary').innerHTML = '';

    for (const producto of productos) {
      // Agrega nombre del cliente
      document.getElementById('userNombre').innerHTML = `<p>${producto.clienteNombre}</p>`
      console.log(producto)
       document.getElementById('userEmail').classList.add('hidden');
        // Muestra Productos al Cliente
       tbody.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-qrcode text-green-600"></i>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${producto.codigo}</div>
                                    <div class="text-sm text-gray-500">https://app.growtap.es/qr/${producto.codigo}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">${producto.url}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="badge badge-success">Activo</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                                <i class="fas fa-edit" data-codigo='${producto.codigo}' data-url='${producto.url}' data-id='${producto.id}'></i> Editar URL
                            </button>
                            <button class="copy-url-button text-green-600 hover:text-green-900" data-url='https://app.growtap.es/qr/${producto.codigo}' id="copy-url-button">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </td>
                    </tr>
      `;
       // Muestra Mis Productos Más Populares
       document.getElementById('myTopProducts').innerHTML += `
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-medium">${producto.codigo}</p>
                        <p class="text-sm text-gray-600 truncate max-w-xs">https://app.growtap.es/qr/${producto.codigo}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-green-600">0</p>
                        <p class="text-sm text-gray-600">escaneos</p>
                    </div>
                </div>
      `
      // Muestra Resumen por Producto
       document.getElementById('productSummary').innerHTML += `
      <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-medium text-gray-900">${producto.codigo}</h4>
                            <p class="text-sm text-gray-600 truncate max-w-xs">${producto.url}</p>
                        </div>
                        <span class="badge badge-success">
                            Activo
                        </span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-600">Total</p>
                            <p class="font-semibold text-indigo-600">0</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Hoy</p>
                            <p class="font-semibold text-green-600">0</p>
                        </div>
                    </div>
                </div>
      `
    }
    
    if(productos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No se encontraron productos.</td></tr>';
    }
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}
// Cliente Presiona Boton Editar o Copiar
document.addEventListener('click', e => {
   if(e.target.className === 'fas fa-edit') {
     document.getElementById('editUrlModal').classList.add('active'); 
     console.log(e.target.getAttribute('data-id'))
     document.getElementById('editUrlCode').value = e.target.getAttribute('data-codigo');
     document.getElementById('editUrlValue').value = e.target.getAttribute('data-url');
     document.getElementById('editUrlForm').setAttribute('data-clienteProducto-id',e.target.getAttribute('data-id'));
    }
   if(e.target.className === 'fas fa-times') {
     document.getElementById('editUrlModal').classList.remove('active'); 
   }
  if(e.target.id === 'copy-url-button') {
    console.log(e.target.getAttribute('data-url'));
    document.querySelector('#notification').classList.add('show');
    navigator.clipboard.writeText(e.target.getAttribute('data-url'))
    setTimeout(() => {
      document.querySelector('#notification').classList.remove('show');
    },2000);
  }
   
});
// Cliente Edita Productos
document.getElementById('editUrlForm').addEventListener('submit', async (e) => {
     e.preventDefault();
     console.log(e.target.getAttribute('data-clienteProducto-id'))
     const productoId = e.target.getAttribute('data-clienteProducto-id');
     const codigo = document.getElementById('editUrlCode').value.trim();
     const url = document.getElementById('editUrlValue').value.trim();

      try {
    const res = await fetch('https://growtapaapp-6.onrender.com/api/clientEditar-productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productoId,
        codigo,
        url,
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
 
})
// Solo llamala así para hacer la lectura rápida y mostrar
listarProductos();