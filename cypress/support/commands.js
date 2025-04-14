import 'cypress-axe'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-real-events/support';

import bs58 from 'bs58'
import { Keypair } from '@solana/web3.js'
import { PhantomWalletMock } from 'phan-wallet-mock'

const publicKeyPat = '[1-9a-z]{32,44}'

let wallet

// before(() => {
//   cy.viewport(1280, 768);
//   cy.visit('/')
//   // NOTE: the phan-wallet-mock is injected inside
//   // tests/cypress/support/index.js and set to `window.solana`
//   // Here we just wait until the app connected to the wallet
//   cy.connectWallet()
// })

Cypress.Commands.add('connectWallet', () => {
  // Inicializar el mock de Phantom Wallet
  cy.window().then(win => {
    wallet = PhantomWalletMock.create(
      Cypress.env('SOLANA_RPC'),
      Keypair.fromSecretKey(
        bs58.decode(
          Cypress.env('WALLET_SEED')
        )
      ),
      'confirmed'
    )
    win.solana = wallet
    win.isE2E = true
  })
  .then(() => wallet.connect())

  // Hacer clic en el botón de conectar wallet
  cy.get('button:has(span:contains("Connect Wallet"))')
    .first()    
    .click({force: true})

  // Seleccionar Phantom en el modal
  cy.get('.wallet-adapter-modal')
    .should('be.visible')
    .contains('Phantom')
    .click()
})

Cypress.Commands.add('checkTextAndClick', (selector, text = '') => {
  cy.get('body').then($body => {
    // Check if the element exists
    if ($body.find(selector).length > 0) {
      // If the element exists, check if it contains the specified text and click
      cy.get(selector).then($el => {
        if ($el.text().includes(text)) {
          cy.wrap($el).eq(0).click()
        }
      })
    } else {
      // Log a message indicating the element was not found
      cy.log(`Element with selector "${selector}" not found.`)
    }
  })
})

Cypress.Commands.add('selectToken', (token, inOrOut = 0) => {
  // click input token button
  cy.get('div[class="flex items-center gap-2 sm:gap-3 cursor-pointer hover:shadow-glowShadow bg-[#262626] border-[#262626] hover:border-defaultBeige border-[1px] px-1 sm:px-[10px] py-1 sm:py-[8px] rounded-[8px]"]').eq(inOrOut)
    .click()

  cy.wait(1000)

  // token dialog
  cy.get('div[class="absolute shadow-activeBtnShadow top-[60%] lg:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-[3px] max-w-[450px] rounded-xl bg-black/70 flex p-5 sm:p-6 flex-col gap-3 h-fit w-[90%] sm:w-full z-[999]"]')
    .should('be.visible')

  // token search bar
  cy.get('div[class="absolute shadow-activeBtnShadow top-[60%] lg:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-[3px] max-w-[450px] rounded-xl bg-black/70 flex p-5 sm:p-6 flex-col gap-3 h-fit w-[90%] sm:w-full z-[999]"]')
    .find('input')
    .should('have.attr', 'id', 'search-token')
    .clear()
    .type(token)

  // choose first token in list
  cy.get('div[class="flex w-full transition duration-500 ease-in-out hover:shadow-activeBtnShadow items-center justify-between gap-4 p-2 rounded-md cursor-pointer hover:bg-white/[0.1]"]')
    .contains('h1[class="text-[14px]"]', new RegExp(`^${token}$`))
    .click()

  // output token should be {token}
  cy.get('div[class="flex items-center gap-2 sm:gap-3 cursor-pointer hover:shadow-glowShadow bg-[#262626] border-[#262626] hover:border-defaultBeige border-[1px] px-1 sm:px-[10px] py-1 sm:py-[8px] rounded-[8px]"]').eq(inOrOut)
    .contains('div', token)
})

Cypress.Commands.add('changeAmount', (amount, inOrOut = 0) => {
  if (inOrOut == 0) {
    cy.get('input[class="w-4/5 p-2 font-satoshi text-white focus:outline-none text-[20px] bg-[#000] text-right"]')
      .clear()
      .type(amount)
      .should('have.value', amount)
  } else if (inOrOut == 1) {
    cy.get('input[class="w-4/5 font-satoshi text-white p-2 focus:outline-none font-light text-[20px] bg-[#000] text-right"]')
      .clear()
      .type(amount)
      .should('have.value', amount)
  }
})

Cypress.Commands.add('swap', () => {
  // start swap
  cy.get('button').contains('Swap').click()
  cy.get('span').contains('Building Transaction')
  cy.get('span').contains('Processing')

  // check confirmation popup
  cy.get('h2').contains('Swap Success!').should('be.visible')
})

Cypress.Commands.add('checkMarketDataValid', (data) => {
  cy.get('div[class="w-full p-1 flex flex-row items-center gap-5"]')
    .contains('p', data)
    .siblings('p')
    .invoke('text')
    .then((text) => {
      const lastChar = text.slice(-1); // K, M, %,...
      if (isNaN(lastChar)) {
        const numberText = text.slice(0, -1);
        expect(parseFloat(numberText)).to.be.a('number');
      } else {
        expect(parseFloat(text)).to.be.a('number');
      }
    })
})

Cypress.Commands.add('disconnectWallet', () => {
  cy.window().then(win => {
    // Verificar si solana existe antes de intentar desconectar
    if (win.solana) {
      win.solana.disconnect()
    }
  })
})

Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe()
  cy.checkA11y()
});

Cypress.Commands.add("mockTransaction", () => {
  cy.window().then(win => {
    win.solana.sendTransaction = () => Promise.resolve({
      signature: "mocked-transaction-signature",
      status: { Ok: null }
    });
  });
});

Cypress.Commands.add("mockTransactionReject",()=>{
  cy.window().then(
    win =>{
      win.solana.signTransaction = () =>Promise.reject(new Error("Mocked transaction rejected"));
    }
  )
})

Cypress.Commands.add('mockTokenBalances', () => {
  cy.window().then(win => {
    // Mock más completo de tokens con la estructura correcta
    const mockTokenAccounts = {
      tokens: {
        'SOL': {
          balance: '1000000000000', // 1000 SOL (considerando 9 decimales)
          decimals: 9,
          mint: 'So11111111111111111111111111111111111111112',
          symbol: 'SOL'
        },
        'USDC': {
          balance: '1000000000', // 1000 USDC (considerando 6 decimales)
          decimals: 6,
          mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          symbol: 'USDC'
        },
        'USDT': {
          balance: '1000000000', // 1000 USDT (considerando 6 decimales)
          decimals: 6,
          mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
          symbol: 'USDT'
        }
      }
    };

    // Mock de los métodos necesarios
    win.solana.getTokenAccounts = () => Promise.resolve(mockTokenAccounts);
    win.solana.getBalance = () => Promise.resolve(1000000000000); // 1000 SOL
  });
});