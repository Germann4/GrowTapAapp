import { createClientChart, renderClientScanEvolutionChart, createProductRoscaChart, renderHourlyActivityChart } from './clientScansChart.js';
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
document.querySelector('.copy-url-button').addEventListener('click', () => {
    document.querySelector('#notification').classList.add('show');
    setTimeout(() => {
        document.querySelector('#notification').classList.remove('show');
    }, 3000);
});
