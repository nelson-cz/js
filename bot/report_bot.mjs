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

        // Resultados generales primero
        let resultadosGenerales = `📊 **Resumen de Tests (Cypress)**\n\n`;
        
        // Detalles por archivo
        let resultadosDetallados = [];

        for (const file of files) {
            const raw = readFileSync(join(reportsDir, file));
            const json = JSON.parse(raw);
            
            // Acumular estadísticas totales
            totalStats.passes += json.stats.passes;
            totalStats.failures += json.stats.failures;
            totalStats.pending += json.stats.pending;
            totalStats.tests += json.stats.tests;
            totalStats.duration += json.stats.duration;
            
            // Crear reporte detallado por archivo
            const testTitle = json.results[0]?.suites[0]?.title || "Test sin título";
            let reportePorArchivo = `\n🔍 **${testTitle}**\n`;
            
            // Extraer suites y tests
            if (json.results && json.results.length > 0) {
                json.results.forEach(result => {
                    if (result.suites && result.suites.length > 0) {
                        result.suites.forEach(suite => {
                            // Agregar información por suite si hay más de una
                            if (suite.title !== testTitle) {
                                reportePorArchivo += `\n📁 ${suite.title}\n`;
                            }
                            
                            // Agregar cada test individual
                            if (suite.tests && suite.tests.length > 0) {
                                suite.tests.forEach(test => {
                                    const estado = test.pass ? "✅" : test.fail ? "❌" : "⚠️";
                                    reportePorArchivo += `${estado} ${test.title} (${test.duration}ms)\n`;
                                });
                            }
                            
                            // Si hay sub-suites, también incluirlas
                            if (suite.suites && suite.suites.length > 0) {
                                suite.suites.forEach(subSuite => {
                                    reportePorArchivo += `\n  📂 ${subSuite.title}\n`;
                                    
                                    if (subSuite.tests && subSuite.tests.length > 0) {
                                        subSuite.tests.forEach(test => {
                                            const estado = test.pass ? "✅" : test.fail ? "❌" : "⚠️";
                                            reportePorArchivo += `  ${estado} ${test.title} (${test.duration}ms)\n`;
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            
            // Estadísticas del archivo
            reportePorArchivo += `\n📊 Resumen: ✅ ${json.stats.passes} | ❌ ${json.stats.failures} | ⏱️ ${json.stats.duration}ms\n`;
            
            resultadosDetallados.push(reportePorArchivo);
        }

        // Completar el resumen general
        resultadosGenerales += `✅ Aprobados: ${totalStats.passes}\n`;
        resultadosGenerales += `❌ Fallidos: ${totalStats.failures}\n`;
        resultadosGenerales += `⚠️ Tests pendientes: ${totalStats.pending}\n`;
        resultadosGenerales += `⏱️ Duración total: ${totalStats.duration} ms\n`;
        resultadosGenerales += `🔁 Total de tests: ${totalStats.tests}\n`;

        // Enviar el resumen general
        await enviarResultado(resultadosGenerales);
        
        // Enviar cada reporte detallado (dividido para evitar problemas con el límite de 2000 caracteres)
        for (const reporte of resultadosDetallados) {
            // Dividir mensajes largos en partes más pequeñas
            const MAX_LENGTH = 1900;
            if (reporte.length <= MAX_LENGTH) {
                await enviarResultado(reporte);
            } else {
                // Dividir el reporte en partes más pequeñas
                let mensaje = '';
                const lineas = reporte.split('\n');
                
                for (const linea of lineas) {
                    if (mensaje.length + linea.length + 1 > MAX_LENGTH) {
                        await enviarResultado(mensaje);
                        mensaje = linea;
                    } else {
                        mensaje += (mensaje.length > 0 ? '\n' : '') + linea;
                    }
                }
                
                if (mensaje.length > 0) {
                    await enviarResultado(mensaje);
                }
            }
        }
        
        // Set timeout to force exit after 5 minutes
        setTimeout(() => {
            console.log('5 minute time limit reached. Closing the bot...');
            process.exit(0);
        }, TIMEOUT);

    } catch (err) {
        await enviarResultado(`⚠️ Error al procesar los reportes: ${err.message}`);
        process.exit(1);
    }
}

main();
