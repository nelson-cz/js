import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.spiderswap.io',
    chromeWebSecurity: true,
    experimentalStudio: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
      timestamp: true
    },
    setupNodeEvents(on, config) {
      return config;
    },
    experimentalRunAllSpecs: true,
  },
  env: {
    SOLANA_RPC: 'https://ratty-wandie-fast-mainnet.helius-rpc.com/',
    WALLET_SEED: '5u15NuNfh7Fsa776YJN3TG6Z3sdMzStFDhzJthRoN8KjGXdD1vLFmYG6AdELneymvQAfhF1rcV1J2vukLn6tBcvd',
    WALLET_ADDR: '9BCpdVZWuKQY4uQFusFhsB3DRSJ5NMdwU5ZMEB9pi873',
    WALLET_SHORT_ADDR: '9BCpd...pi873'
  },
  video: false,
  numTestsKeptInMemory: 50,
});