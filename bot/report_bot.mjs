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

        // General results first
        let resultadosGenerales = `📊 **Cypress Test Summary**\n\n`;
        
        // Details by file
        let resultadosDetallados = [];

        for (const file of files) {
            const raw = readFileSync(join(reportsDir, file));
            const json = JSON.parse(raw);
            
            // Accumulate total statistics
            totalStats.passes += json.stats.passes;
            totalStats.failures += json.stats.failures;
            totalStats.pending += json.stats.pending;
            totalStats.tests += json.stats.tests;
            totalStats.duration += json.stats.duration;
            
            // Create detailed report per file
            const testTitle = json.results[0]?.suites[0]?.title || "Untitled Test";
            let reportePorArchivo = `\n🔍 **${testTitle}**\n`;
            
            // Extract suites and tests
            if (json.results && json.results.length > 0) {
                json.results.forEach(result => {
                    if (result.suites && result.suites.length > 0) {
                        result.suites.forEach(suite => {
                            // Add information per suite if there is more than one
                            if (suite.title !== testTitle) {
                                reportePorArchivo += `\n📁 ${suite.title}\n`;
                            }
                            
                            // Add each individual test
                            if (suite.tests && suite.tests.length > 0) {
                                suite.tests.forEach(test => {
                                    const estado = test.pass ? "✅" : test.fail ? "❌" : "⚠️";
                                    reportePorArchivo += `${estado} ${test.title} (${test.duration}ms)\n`;
                                });
                            }
                            
                            // If there are sub-suites, include them too
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
            
            // File statistics
            reportePorArchivo += `\n📊 Summary: ✅ ${json.stats.passes} | ❌ ${json.stats.failures} | ⏱️ ${json.stats.duration}ms\n`;
            
            resultadosDetallados.push(reportePorArchivo);
        }

        // Complete the general summary
        resultadosGenerales += `✅ Passed: ${totalStats.passes}\n`;
        resultadosGenerales += `❌ Failed: ${totalStats.failures}\n`;
        resultadosGenerales += `⚠️ Pending tests: ${totalStats.pending}\n`;
        resultadosGenerales += `⏱️ Total duration: ${totalStats.duration} ms\n`;
        resultadosGenerales += `🔁 Total tests: ${totalStats.tests}\n`;

        // Send the general summary
        await enviarResultado(resultadosGenerales);
        
        // Send each detailed report (divided to avoid issues with the 2000 character limit)
        for (const reporte of resultadosDetallados) {
            // Divide long messages into smaller parts
            const MAX_LENGTH = 1900;
            if (reporte.length <= MAX_LENGTH) {
                await enviarResultado(reporte);
            } else {
                // Divide the report into smaller parts
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
        await enviarResultado(`⚠️ Error processing reports: ${err.message}`);
        process.exit(1);
    }
}

main();
