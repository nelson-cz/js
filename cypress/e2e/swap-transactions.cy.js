describe('Swap Transactions',()=>{
    beforeEach(()=>{
        // Interceptar TODAS las solicitudes y modificar headers
        cy.intercept('**/*', (req) => {
            // Forzar los headers
            delete req.headers['user-agent'];
            delete req.headers['sec-ch-ua'];
            delete req.headers['sec-ch-ua-platform'];
            
            Object.assign(req.headers, {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Cypress/12.0.0',
              'X-Cypress-Test': 'true',
              'X-Testing-Environment': 'production',
              'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
              'sec-ch-ua-platform': '"Windows"',
              'sec-ch-ua-mobile': '?0',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
              'Cache-Control': 'no-cache'
            });
        }).as('requests');

        cy.clearLocalStorage()
        cy.clearCookies()
        cy.visit('/') 
       
    })

    it('should swap tokens successfully',()=>{
        // Conectar wallet primero
        cy.window().then(win=>{
            const hasSolanaProvider = Boolean(win.solana)
            cy.log(`Solana provider: ${hasSolanaProvider}`)
        }) 
        cy.connectWallet()
        cy.wait(3000)

        cy.get('h2').then($h2 =>{
            const h2 = $h2.text().includes('Terms & Conditions')
            if(h2){
                cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
                cy.get('@checkbox').click()
                cy.get('button').contains('Confirm').should('be.visible').click()
            }else{
                return true;
            }
        })


        /* cy.get('h2').contains('Terms & Conditions').should('be.visible')
        cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
        cy.get('@checkbox').click()
        cy.get('@checkbox').prev().should('be.checked')
        cy.get('button').contains('Confirm').should('be.visible').click()
         */
        
        // Luego hacer los mocks
        
        
        // Seleccionar token de entrada
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        
        // Ingresar cantidad
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('0.002')
        
        // Esperar a que se calcule el precio
        cy.mockTokenBalances()
        cy.mockTransaction()
    })

    it('should handle transaction rejection',()=>{
        // Conectar wallet
        cy.window().then(win=>{
            const hasSolanaProvider = Boolean(win.solana)
            cy.log(`Solana provider: ${hasSolanaProvider}`)
        }) 
        cy.connectWallet()
        cy.wait(3000)
            /* cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click() */
        
        
        // Mock de balances y transacción rechazada
        cy.mockTokenBalances()
        
        
        // Seleccionar token de entrada
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        
        // Ingresar cantidad
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('0.002')
        
        // Esperar a que se calcule el precio
        cy.wait(2000)

        cy.mockTransactionReject()
        
    })

    it('should handle insufficient balance',()=>{
        // Conectar wallet
        cy.connectWallet()
        cy.wait(3000)
        
        // Mock de balances bajos
        cy.window().then(win => {
            win.solana = {
                ...win.solana,
                getBalance: () => Promise.resolve(1000000), // 0.001 SOL
                getTokenAccounts: () => Promise.resolve({
                    tokens: {
                        'SOL': {
                            balance: '1000000',
                            decimals: 9,
                            mint: 'So11111111111111111111111111111111111111112',
                            symbol: 'SOL'
                        }
                    }
                })
            }
        })
        
        // Seleccionar token de entrada
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        
        // Ingresar cantidad mayor al balance
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('1000')
        
        // Esperar a que se calcule el precio
        cy.wait(2000)
        cy.get('button').contains('Insufficient').should('be.visible')
    })


    it('Route plan is visible',()=>{
        cy.connectWallet()
        cy.wait(3000)
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('0.002')
        cy.wait(5000)
        cy.get('label').contains('Route Plan').should('be.visible')
        cy.get('[class="flex gap-1 items-center cursor-pointer"]')
            .children('img')
            .should('have.length', 2);
    })

    it('Minimun value received is visible',()=>{
        cy.connectWallet()
        cy.wait(3000)
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        
    
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('0.002')
        
        cy.wait(2000)
        cy.get('#label1').should('not.be.empty')
        
        
    })

    it('Price impact normal is visible',()=>{
        cy.connectWallet()
        cy.wait(3000)
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('0.002')
        
        cy.wait(5000)
        cy.get('[class=" text-defaultBeige text-[10px] sm:text-[14px] leading-5 sm:leading-7"]').should('not.be.empty')
    })

    it('Price (High) impact warning is visible',()=>{
        cy.connectWallet()
        cy.wait(3000)

        cy.get(':nth-child(3) > .items-end > .w-full > .gap-2 > .flex > .hidden > .text-white').click();
        cy.get('#search-token').clear();
        cy.get('#search-token').type('usdt');
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click();
        cy.get('.justify-center > .w-full > .w-4\\/5').clear('1');
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        cy.get('.justify-center > .w-full > .w-4\\/5').type('100000');
        cy.wait(5000)
        cy.get('span').contains('High Price Impact').should('exist')


    })
    it('Price difference is visible',()=>{
        cy.connectWallet()
        cy.wait(3000)
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('0.002')
        cy.wait(5000)
        cy.get('#pd').should('not.be.empty')
    })
    it('Price (High) warning difference is visible',()=>{
        cy.connectWallet()
        cy.wait(3000)
        cy.get(':nth-child(3) > .items-end > .w-full > .gap-2 > .flex > .hidden > .text-white').click();
        cy.get('#search-token').clear();
        cy.get('#search-token').type('usdt');
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click();
        cy.get('.justify-center > .w-full > .w-4\\/5').clear('1');
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        cy.get('.justify-center > .w-full > .w-4\\/5').type('1000000');
        cy.wait(5000);
        cy.get('span').contains('High Price Diff').should('exist') 
    })


    it('Price not found with 100000000 in swap',()=>{
        cy.connectWallet()
        cy.wait(3000)
        
        // Mock de balances y transacción
        cy.mockTokenBalances()
        cy.mockTransaction()
        
        // Seleccionar token de entrada
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        
        // Ingresar cantidad grande para forzar alto slippage
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('100000000')
        /* ==== Generated with Cypress Studio ==== */
        cy.get('.text-yellow-500').contains('Price Not Found').should('be.visible')
    })

    it('Slippage porcentage is visible',()=>{
        // Conectar wallet
        cy.connectWallet()
        cy.wait(3000)
        
        // Mock de balances y transacción
        cy.mockTokenBalances()
        cy.mockTransaction()
        
        // Seleccionar token de entrada
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('100000000')
        
        // Esperar a que se calcule el precio
        cy.wait(2000)
        cy.get('#slippage').should('not.be.empty')
    })


    it('Current Fee is visible',()=>{
        cy.connectWallet()
        cy.wait(3000)
        cy.get('.justify-center > .w-full > .gap-2 > .pr-3 > .hidden > .text-white').click()
        cy.get('#search-token').clear().type('sol')
        cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click()
        cy.get('.justify-center > .w-full > .w-4\\/5').clear().type('0.002')
        cy.wait(5000)
        cy.get('label').contains('Current Fee').should('be.visible')
        cy.get('#fee').should('not.be.empty')
    })

    it('should confirm transaction details',()=>{
        // Preparar el entorno
        cy.connectWallet()
        cy.wait(3000)
        cy.mockTokenBalances()
        cy.mockTransactionSigning()
        cy.mockTransaction()
       
    })
})
