// archivo: ejecutarTestYReportar.js

import { enviarResultado } from './index.mjs';
import { exec } from 'child_process';
import { readFileSync } from 'fs';

exec('npx cypress run', async (error) => {
    try {
      const reportPath = './cypress/reports/mochawesome.json';
      const raw = readFileSync(reportPath);
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
