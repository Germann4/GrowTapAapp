import { createDashboardChart, createStatsChart, createClientDistributionChart } from './adminScansChart.js';

  /* Redirección al login con botón de cerrar sesión  */
  document.querySelector('#logoutBtn').addEventListener('click', () => {
  window.location.href = 'http://127.0.0.1:5500/login.html'
  });
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
  });
  /* Abrir Modal Nuevo Cliente */
  document.querySelector('#addClientBtn').addEventListener('click', () => {
      document.querySelector('#clientModal').classList.add('active');
  });
  /* Cerrar Modal Nuevo Cliente */
  document.querySelector('.close-new-customer-modal').addEventListener('click', () => {
      document.querySelector('#clientModal').classList.remove('active');
  });
  /* Abrir Modal Editar Cliente */
  document.querySelector('.BtnEdit').addEventListener('click', () => {
      console.log('Editar')
      document.querySelector('.ClientEdit').classList.add('active');
  });
   /* Cerrar Modal Editar Cliente */
  document.querySelector('.CloseEditClientModal').addEventListener('click', () => {
      document.querySelector('.ClientEdit').classList.remove('active');
  });
  /* Abrir Modal Editar Producto */
  document.querySelector('.Edit-Product-Btn').addEventListener('click', () => {
      document.querySelector('#productModal').classList.add('active');
      console.log('producto boton')
  });
  /*Cerrar Modal Editar Producto */
  document.querySelector('.Close-product-modal').addEventListener('click', () => {
      document.querySelector('#productModal').classList.remove('active');
  });
 
  /* Crear nuevos usaurios desde administrador */
   
  /*
  document.querySelector('#clientsTableBody').innerHTML += `
  <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span class="text-indigo-600 font-medium">R</span>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">Restaurante El Buen Sabor</div>
                                    <div class="text-sm text-gray-500">ID: 2</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">restaurante@demo.com</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="badge badge-success">Activo</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="editClient(2)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteClient(2)" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
  `
  */
const clientForm = document.getElementById('clientForm');

clientForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const estado = document.getElementById('clientStatus').value;

  try {
    const res = await fetch('http://localhost:3000/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, estado })
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert('Error: ' + (errorData.error || 'No se pudo guardar cliente'));
      return;
    }

    const data = await res.json();
    alert('Cliente guardado con ID: ' + data.id);
    clientForm.reset();

  } catch (error) {
    alert('Error al guardar cliente: ' + error.message);
  }
});
