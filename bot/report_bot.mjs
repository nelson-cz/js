// archivo: ejecutarTestYReportar.js

const {enviarResultado} = require('./index');
const {exec} = require('child_process');
const fs = require('fs');

exec('npx cypress run', async (error) => {
    try {
      const reportPath = './cypress/reports/mochawesome.json';
      const raw = fs.readFileSync(reportPath);
      const json = JSON.parse(raw);
  
      const stats = json.stats;
      const resultados = `
  📊 **Resultados del test (Cypress)**
  
  ✅ Pasaron: ${stats.passes}
  ❌ Fallaron: ${stats.failures}
  ⚠️ Tests pendientes: ${stats.pending}
  ⏱️ Duración: ${stats.duration} ms
  🔁 Total de tests: ${stats.tests}
  `;
  
      await enviarResultado(resultados);
    } catch (err) {
      await enviarResultado(`⚠️ Error al leer el reporte JSON: ${err.message}`);
    }
});
