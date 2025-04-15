// archivo: ejecutarTestYReportar.js

import { enviarResultado } from './index.mjs';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// Set a 5-minute timeout
const TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

async function main() {
    try {
        const reportsDir = './cypress/reports';
        const files = readdirSync(reportsDir).filter(f => f.startsWith('mochawesome') && f.endsWith('.json'));
        
        let totalStats = {
            passes: 0,
            failures: 0,
            pending: 0,
            tests: 0,
            duration: 0
        };

        for (const file of files) {
            const raw = readFileSync(join(reportsDir, file));
            const json = JSON.parse(raw);
            totalStats.passes += json.stats.passes;
            totalStats.failures += json.stats.failures;
            totalStats.pending += json.stats.pending;
            totalStats.tests += json.stats.tests;
            totalStats.duration += json.stats.duration;
        }

        const resultados = `
📊 **Resultados del test (Cypress)**

✅ Pasaron: ${totalStats.passes}
❌ Fallaron: ${totalStats.failures}
⚠️ Tests pendientes: ${totalStats.pending}
⏱️ Duración: ${totalStats.duration} ms
🔁 Total de tests: ${totalStats.tests}
`;

        await enviarResultado(resultados);
        
        // Set timeout to force exit after 5 minutes
        setTimeout(() => {
            console.log('Tiempo límite de 5 minutos alcanzado. Cerrando el bot...');
            process.exit(0);
        }, TIMEOUT);

    } catch (err) {
        await enviarResultado(`⚠️ Error al procesar los reportes: ${err.message}`);
        process.exit(1);
    }
}

main();
