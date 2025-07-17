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
export function createClientDistributionChart(ctx) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Clientes verdes', 'Clientes violetas'],
      datasets: [{
        data: [30, 70],
        backgroundColor: ['#4CAF50', '#763b8fff'], // verde y violeta
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '50%', // más grosor (valor más chico = rosquita más gruesa)
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        }
      }
    }
  });
}
