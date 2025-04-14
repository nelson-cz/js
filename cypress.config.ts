const { defineConfig } = require('cypress')

module.exports = defineConfig({

  reporter: 'mochawesome',
  reporterOptions:{
    reportDir: 'cypress/reports',
    overwrite: true, // true para que se sobrescriba el archivo anterior
    html: false, //no se genera el archivo html
    json: true, //se genera el archivo json
    timestamp: 'mmddyyyy_HHMMss' //se genera el archivo con el tiempo actual
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    testIsolation: false,
    defaultCommandTimeout: 30000,
    setupNodeEvents (on, config) {
    },
    experimentalStudio: true

  },
  env: {
    SOLANA_RPC: 'https://ratty-wandie-fast-mainnet.helius-rpc.com/',
    WALLET_SEED: '5u15NuNfh7Fsa776YJN3TG6Z3sdMzStFDhzJthRoN8KjGXdD1vLFmYG6AdELneymvQAfhF1rcV1J2vukLn6tBcvd',
    WALLET_ADDR: '9BCpdVZWuKQY4uQFusFhsB3DRSJ5NMdwU5ZMEB9pi873',
    WALLET_SHORT_ADDR: '9BCpd...pi873'
  },
  video: false
})