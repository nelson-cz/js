describe('Home spiderswap',()=>{
    beforeEach(()=>{
        cy.intercept('*', (req) => {
            req.headers = {
              ...req.headers,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Cypress/12.0.0',
              'X-Cypress-Test': 'true',
              'X-Testing-Environment': 'production',
              'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
              'sec-ch-ua-platform': '"Windows"',
              'sec-ch-ua-mobile': '?0',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
              'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
            };
          });
        cy.clearLocalStorage()
        cy.clearCookies()
        cy.viewport(1920, 1080);
        cy.visit('/home')
        cy.disconnectWallet()

    })
    it('Home can be opened',()=>{
        cy.get('h1').should('contain','Your Gateway to Solana Aggregation').should('be.visible')
    })
    it('Spiderswap contains title',()=>{
        cy.title().should('contain','Welcome to Spiderswap: Your Gateway to DeFi on Solana | High-Speed, Low-Cost Transactions')
    })
    it('Home contains title logo',()=>{
        cy.get('span').should('contain','Spiderswap').should('be.visible')
    })
    describe('Navbar tests', () => {
        it('Navbar contains Spiderswap logo and text', () => {
            cy.get('span').contains('Spiderswap')
                .should('be.visible')
                .should('have.class', 'font-bold')
                .should('have.class', 'font-satoshi')
        })
        it('Navbar contain change language button/box',()=>{
            cy.get('div.flex.flex-wrap.gap-1.min-\\[940px\\]\\:gap-2.items-center').should('exist').should('be.visible')
        })
        it('Navbar/div box exist ',()=>{
            
            const navbar = cy.get('div.min-\\[1324px\\]\\:flex.hidden.row.uppercase')
                .should('exist')
                .should('be.visible')
            // navbar.children('div').should('have.length',5)
        })
        it('Navbar/div box contains 5 children links',()=>{
            cy.get('div.min-\\[1324px\\]\\:flex.hidden.row.uppercase').children('div').should('have.length',5)
        })
       
        it('Navbar contains wallet connect button', () => {
            cy.get('button').children('span').should('contain','Connect Wallet').should('be.visible')
        })
        it('wallet connect button can be clicked',()=>{
            // Esperar a que el botón esté disponible y sea interactuable
            cy.get('button:has(span:contains("Connect Wallet"))')
                .first()    
                .should('be.visible')
                .should('be.enabled')
                .click({force:true})
        })
        it('Select wallet modal is visible',()=>{
            cy.get('button:has(span:contains("Connect Wallet"))')
                .first()    
                .should('be.visible')
                .should('be.enabled')
                .click({force:true})
            cy.get('div.wallet-adapter-modal-wrapper').should('be.visible')
            
                
        })
        it('In modal there is a close modal button',()=>{
            cy.get('button:has(span:contains("Connect Wallet"))')
                .first()    
                .should('be.visible')
                .should('be.enabled')
                .click()
            cy.get('div.wallet-adapter-modal-wrapper').should('be.visible')
            cy.get('button.wallet-adapter-modal-button-close').should('exist')
        })
        it('Close modal button can be clicked',()=>{
            cy.get('button:has(span:contains("Connect Wallet"))')
            .first()    
            .should('be.visible')
            .should('be.enabled')
            .click({force:true})
            cy.get('div.wallet-adapter-modal-wrapper').should('be.visible')
            cy.get('button.wallet-adapter-modal-button-close').should('be.visible').click()

        })
        it('Select wallet modal contains ledger',()=>{
            cy.get('button:has(span:contains("Connect Wallet"))')
                .first()    
                .should('be.visible')
                .should('be.enabled')
                .click()
            cy.get('div.wallet-adapter-modal').should('be.visible')
            cy.get('h1.wallet-adapter-modal-title').children('div.ledger-container').children('label').should('have.length',2).and('be.visible')
        })
        it('Spiderswap detects compatible wallets or wallets extensions',()=>{
            cy.window().then(win=>{
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            })            
        })
        it('wallets can be connected',()=>{
            cy.connectWallet()
        })

    })
    it('Home contains button for open dapp',()=>{
        cy.get('a').should('contain','Open dApp').should('be.visible')
    })
    it('Home contains button for open documentation',()=>{
        cy.get('a').filter('[href="https://webpaper.spiderswap.io/whitepaper"]').should('exist').should('be.visible')
    })
    it('Home contains graph',()=>{
        cy.get('h1').should('contain','Your Gateway to Solana Aggregation').should('be.visible')
        cy.get('h1').should('contain','Staking Stats').should('be.visible')
        cy.get('canvas').should('exist').should('be.visible')
    })
    describe('Home contains Partners section',()=>{
        it('Home contains Partners section',()=>{
            cy.get('h1').should('contain','Partners').should('be.visible')
        })
        it('Home contains div for carousel',()=>{
            cy.get('div.flex.space-x-16.animate-loop-scroll').should('exist').should('be.visible')
        })
        it('Partners section contains 50 logos',()=>{
            cy.get('h1').should('contain','Partners').should('be.visible')
            cy.get('div.flex.space-x-16.animate-loop-scroll').should('exist').should('be.visible')
            cy.get('div.flex.space-x-16.animate-loop-scroll').children('img').should('have.length',50).and('be.visible')
        }) 
    })

    it('Home contains  Our Services section',()=>{
        cy.get('h1').should('contain','Our Services').should('be.visible')
        cy.get('p').should('contain','Swap').should('be.visible')
        cy.get('p').should('contain','Staking').should('be.visible')
        cy.get('p').should('contain','Spider API').should('be.visible')
        cy.get('p').should('contain','Bulk Transfer').should('be.visible')
        cy.get('p').should('contain','Bridge').should('be.visible')
    })
    describe('Home contains Our Social Feed section',()=>{
        it('Home contains Our Social Feed section',()=>{
            cy.get('h1').should('contain','Our Social Feed').should('be.visible')
        })
        it('Home contains div for tweets',()=>{
            cy.get('div.w-full').filter('.flex.flex-col.xl\\:flex-row.gap-5')
                .should('exist')
                .should('be.visible')
        })
        it('div for tweets contains 4 tweets',()=>{
            cy.get('div.w-full').filter('.flex.flex-col.xl\\:flex-row.gap-5')
                .children('div')
                .should('have.length', 4)
        })
    })
   describe('Footer tests',()=>{
    it('footer/div box exist', () => {
        cy.get('div.flex.flex-row.sm\\:pl-5.md\\:gap-4.gap-2')
            .should('exist').parent('div').parent('div').should('exist').should('be.visible')
    })
    it('Footer contains 4 links',()=>{
        cy.get('div.flex.flex-row.sm\\:pl-5.md\\:gap-4.gap-2')
            .children('a')
            .should('have.length', 4)
    })
    it('4 links in footer can be clicked',()=>{
        cy.get('div.flex.flex-row.sm\\:pl-5.md\\:gap-4.gap-2')
            .children('a')
            .should('have.length', 4)
            .each(($href, index) => {
                cy.wrap($href).click()
                
            })
    })
    it('Footer contains Powered by Czlabs',()=>{
        cy.get('span').contains('POWERED BY').should('exist').should('be.visible')
    })
    it('Powered by Czlabs can be clicked',()=>{
        cy.get('span').contains('POWERED BY').should('exist').should('be.visible').click()
        
    })
   })
})