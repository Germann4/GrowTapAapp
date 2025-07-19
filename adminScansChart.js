/* Crea un gráfico de líneas para el Dashboard con datos de escaneos por día. */
export function createDashboardChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['7/7/2025', '8/7/2025', '9/7/2025', '10/7/2025', '11/7/2025', '12/7/2025', '13/7/2025'],
      datasets: [{
        label: 'Escaneos por día',
        data: [1, 3, 5, 2, 7, 4, 6],
        backgroundColor: 'rgba(207, 210, 190, 0.36)',
        borderColor: 'rgba(0, 17, 255, 0.76)',
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
/* Crea un gráfico de líneas para la sección de Estadísticas con datos de escaneos por día. */
export function createStatsChart(ctx) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['9/7/2025', '10/7/2025', '11/7/2025', '12/7/2025', '13/7/2025', '14/7/2025', '15/7/2025'],
      datasets: [{
        label: 'Escaneos por día',
        data: [1, 3, 5, 2, 4, 1, 0],
        backgroundColor: 'rgba(222, 139, 29, 0.2)',
        borderColor: 'rgba(248, 102, 29, 1)',
        borderWidth: 2,
        tension: 0.2,
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
/* Crea una rosquita 30% verde y 70% violeta con más grosor */
export function createClientDistributionChart(ctx, hourlyData) {
  const labels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Escaneos por Hora',
        data: hourlyData,
        backgroundColor: '#10b981', // verde
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
          min: 0,
          max: 6,
          ticks: {
            stepSize: 1,
            callback: (value) => value
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
