/* Función que crea y devuelve un gráfico de líneas mostrando la evolución de los escaneos diarios del cliente en la última semana. */
export function createClientChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['7/7/2025', '8/7/2025', '9/7/2025', '10/7/2025', '11/7/2025', '12/7/2025', '13/7/2025'],
      datasets: [{
        label: 'Mis Escaneos',
        data: [2, 4, 1, 6, 3, 5, 2],
        backgroundColor: 'rgba(34, 175, 116, 0.2)',
        borderColor: 'rgba(16, 225, 141, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 7, ticks: { stepSize: 1 } },
        x: {}
      },
      plugins: { legend: { display: false } }
    }
  });
}
/* Función que crea y devuelve un gráfico de línea mostrando la evolución de escaneos del cliente en los últimos 7 días. */
export function renderClientScanEvolutionChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['13/7/2025','14/7/2025','15/7/2025','16/7/2025','17/7/2025','18/7/2025','19/7/2025'],
      datasets: [{
        label: 'Mis Escaneos',
        data: [2, 1, 5, 3, 4, 2, 3],
        backgroundColor: 'rgba(131, 50, 149, 0.2)',
        borderColor: 'rgba(125, 6, 245, 1)',
        borderWidth: 2.5,
        tension: 0.6,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { min: 0, max: 5, ticks: { stepSize: 1 } },
        x: {}
      },
      plugins: { legend: { display: false } }
    }
  }); 
}
/* Función que crea y devuelve un gráfico de dona */
export function createProductRoscaChart(ctx){
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['4CAF50', '5b06f0ff'],
      datasets: [{
        data: [45, 65],
        backgroundColor: ['#4CAF50', '#5b06f0ff'], // verde y violeta
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '47%', // más grosor (valor más chico = rosquita más gruesa)
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        }
      }
    }
  }); 
}
/* Función que crea y devuelve un gráfico de barras verticales para mostrar la cantidad de escaneos por cada hora del día (0 a 23). */
export function renderHourlyActivityChart(ctx, hourlyData) {
  const labels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Escaneos por Hora',
        data: hourlyData,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            max: 6
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 45
          }
        }
      }
    }
  });
}
