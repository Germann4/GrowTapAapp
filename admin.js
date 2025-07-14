 document.querySelector('#logoutBtn').addEventListener('click', () => {
  window.location.href = 'http://127.0.0.1:5500/login.html'
  });
  const ctx = document.getElementById('scansChart').getContext('2d');
  
  const scansChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        '7/7/2025',
        '8/7/2025',
        '9/7/2025',
        '10/7/2025',
        '11/7/2025',
        '12/7/2025',
        '13/7/2025'
      ],
      datasets: [{
        label: 'Escaneos por día',
        data: [1, 3, 5, 2, 7, 4, 6], // Valores de ejemplo entre 0 y 7
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 0,
          max: 7,
          ticks: {
            stepSize: 1,
            reverse: false // Esto mantiene el 0 abajo y el 7 arriba
          },
          title: {
            display: true
          }
        },
        x: {
          title: {
            display: true
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  
  /*oculta el contenido contenido clients */
  document.querySelector('.dashboard').addEventListener('click', (e) =>{
    console.log('dashboard')
     document.querySelector('#dashboard').classList.remove('hidden');
     document.querySelector('#clients').classList.add('hidden');  
     document.querySelector('#products').classList.add('hidden');
     document.querySelector('.analytics').classList.add('hidden');
  });
  /*oculta el contenido contenido dashboard */
  document.querySelector('.clients').addEventListener('click', (e) =>{
     console.log('Clientes')
     document.querySelector('#dashboard').classList.add('hidden');  
     document.querySelector('#clients').classList.remove('hidden');
     document.querySelector('#products').classList.add('hidden');
     document.querySelector('.analytics').classList.add('hidden');
  });
  document.querySelector('.products').addEventListener('click', (e) => {
      console.log('products')
      document.querySelector('#dashboard').classList.add('hidden');
      document.querySelector('#clients').classList.add('hidden');
      document.querySelector('.analytics').classList.add('hidden');
      document.querySelector('#products').classList.remove('hidden');
  });
  document.querySelector('.close-modal').addEventListener('click', () => {
      document.querySelector('#importModal').classList.remove('active'); 
  });
  document.querySelector('#importProductsBtn').addEventListener('click', () => {
      document.querySelector('#importModal').classList.add('active'); 
  });
  document.querySelector('#addProductBtn').addEventListener('click', () => {
      document.querySelector('#productModal').classList.add('active'); 
  });
  document.querySelector('.close-new-product-modal').addEventListener('click', () => {
      document.querySelector('#productModal').classList.remove('active'); 
  });
  document.querySelector('#addClientBtn').addEventListener('click', () => {
      document.querySelector('#clientModal').classList.add('active');
  });
  document.querySelector('.close-new-customer-modal').addEventListener('click', () => {
      document.querySelector('#clientModal').classList.remove('active');
  });
      document.querySelector('.BtnEdit').addEventListener('click', () => {
      document.querySelector('#clientModal').classList.add('active'); 
  });
  document.querySelector('.Edit-Product-Btn').addEventListener('click', () => {
      document.querySelector('#productModal').classList.add('active');
  });
  document.querySelector('.Close-product-modal').addEventListener('click', () => {
      document.querySelector('#productModal').classList.remove('active');
  });
  document.querySelector('.statistics').addEventListener('click', () => {
      document.querySelector('#dashboard').classList.add('hidden');
      document.querySelector('#clients').classList.add('hidden');  
      document.querySelector('#products').classList.add('hidden');
      document.querySelector('.analytics').classList.remove('hidden');
  });