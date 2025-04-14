describe('Swap spiderswap',()=>{
    beforeEach(()=>{
        cy.clearLocalStorage()
        cy.clearCookies()
        cy.viewport(1920, 1080)
        cy.visit('/') 
        cy.disconnectWallet()
    })
    it('Spiderswap can be openned',()=>{
        cy.get('span').should('contain','Spiderswap').should('be.visible')
    })
    describe('Navbar complete tests', () => {
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

        it('Button swap can be clicked',()=>{
            cy.get(':nth-child(2) > .flex-row > .group-hover\\:text-white').click();
        })
        it('How wallet connect ,open modal Terms and Conditions for first time',()=>{
            cy.window().then(win=>{
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            }) 
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
        })
        it('Terms and Conditions includes check box for accept terms and conditions',()=>{
            cy.window().then(win=>{
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            }) 
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible')
            cy.get('input[type="checkbox"]').should('be.visible')
        })
        it('Terms and Conditions includes check box checked',()=>{
            cy.window().then(win=>{
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            }) 
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            const checkbox = cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible')
            checkbox.click()
            checkbox.prev().should('be.checked')
            // cy.get('input[type="checkbox"]').should('be.visible').click()
            // cy.get('input[type="checkbox"]').should('be.checked')
        })
        it('Terms and Conditions includes check box unchecked',()=>{
            cy.window().then(win=>{
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            }) 
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('@checkbox').click()
            cy.get('input[value="false"]').next('span').contains('I have read and accept the Terms and Conditions.').should('be.visible')
            
            // cy.get('input[type="checkbox"]').should('be.visible').click()
            // cy.get('input[type="checkbox"]').should('be.checked')
            // cy.get('input[type="checkbox"]').should('be.visible').click()
            // cy.get('input[type="checkbox"]').should('not.be.checked')
        })
        it('Terms and Conditions includes button to accept terms and conditions',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('button').contains('Confirm').should('be.visible').click()
      
            
        })
        it('Confirm button can be clicked',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('button').contains('Confirm').should('be.visible')
            cy.get('button').contains('Confirm').click()
        })
        it('Terms and Conditions can be closed',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible').as('titleTerms')
            
            cy.get('@titleTerms').parent().parent().click(10 , 50)
        })
        it('If wallet is Connect , Navbar contain Generate Key button',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('svg')
                .find('title')
                .contains('Generate Key')
                .parent('svg')
                .should('be.visible')
    
        })   
        it('Gernerate key button can be clicked',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('svg')
                .find('title')
                .contains('Generate Key')
                .parent('svg')
                .should('be.visible')
                .click()
        })
        it('Generate Key modal is open',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('svg')
                .find('title')
                .contains('Generate Key')
                .parent('svg')
                .should('be.visible')
                .click()
            cy.get('div').contains('Your API Key').should('be.visible')
            
        })
        it('If generate key modal is open ,exit button exist',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('svg')
                .find('title')
                .contains('Generate Key')
                .parent('svg')
                .should('be.visible')
                .click()
            cy.get('div').contains('Your API Key').should('be.visible').as('apiKey')
            cy.get('@apiKey').next('svg').should('be.visible')
        })
        it('If generate key modal is open ,exit button can be clicked',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('svg')
                .find('title')
                .contains('Generate Key')
                .parent('svg')
                .should('be.visible')
                .click()
            cy.get('div').contains('Your API Key').should('be.visible').as('apiKey')
            cy.get('@apiKey').next('svg').should('be.visible').click()
        })
        it('Generate key modal contains Key box',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('svg')
                .find('title')
                .contains('Generate Key')
                .parent('svg')
                .should('be.visible')
                .click()
            cy.get('div').contains('Your API Key').should('be.visible').as('apiKey')
            cy.get('div')
                .should('have.class', 'w-full')
                .should('have.class', 'top-2')
                .should('have.class', 'right-2')
                .should('have.class', 'text-white')
                .should('have.class', 'py-[6px]')
                .should('have.class', 'text-[16px]')
                .should('have.class', 'flex')
                .should('have.class', 'justify-between')
                .should('have.class', 'items-center')
                .should('have.class', 'font-medium')
                .should('have.class', 'rounded-md')
                .should('have.class', 'px-3')
                .should('have.class', 'leading-7')
                .should('have.class', 'overflow-hidden')
                .should('have.class', 'bg-white/15')
                .should('have.class', 'backdrop-blur-[90px]')
                .should('be.visible')
        })
        it('Key box contains Key to copy and extra buttons',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
           
        })
        it('Key to copy can be clicked and copied',()=>{
            cy.window().then(
                win=>{
                    const hasSolanaProvider = Boolean(win.solana)
                    cy.log(`Solana provider: ${hasSolanaProvider}`)
                }
            )
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()


            /* ==== Generated with Cypress Studio ==== */
            cy.get('.min-\\[1324px\\]\\:flex.-mt-3 > .flex-wrap > :nth-child(2) > .relative > .cursor-pointer > path').click();
            cy.get('.top-2 > .flex > [fill="none"]').click();
            /* ==== End Cypress Studio ==== */
        })
        it('Delete API Key button exists and can be clicked', () => {
            cy.window().then(win => {
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            })
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()

            /* ==== Generated with Cypress Studio ==== */
            cy.get('.min-\\[1324px\\]\\:flex.-mt-3 > .flex-wrap > :nth-child(2) > .relative > .cursor-pointer').click();
            cy.get('button.text-xl > svg').click();
            /* ==== End Cypress Studio ==== */
        })
        it('Share API Key button exists and can be clicked',()=>{
            cy.window().then(win => {
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            })
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            /* ==== Generated with Cypress Studio ==== */
            cy.get('.min-\\[1324px\\]\\:flex.-mt-3 > .flex-wrap > :nth-child(2) > .relative > .cursor-pointer').click();
            cy.get('.top-2 > .flex > svg.text-xl').click();
            /* ==== End Cypress Studio ==== */
        })

        it('Trading History button exists and can be clicked', () => {
            cy.window().then(win => {
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            })
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()

            /* ==== Generated with Cypress Studio ==== */
            cy.get('.min-\\[1324px\\]\\:flex.-mt-3 > .flex-wrap > :nth-child(4) > .cursor-pointer').click();
            /* ==== End Cypress Studio ==== */
        })
        it('Trading History modal is open',()=>{
            cy.window().then(win => {
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            })
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('.min-\\[1324px\\]\\:flex.-mt-3 > .flex-wrap > :nth-child(4) > .cursor-pointer').click();
            cy.get('div').contains('Transaction history').should('be.visible')
            
        })
        it('Trading History modal contains swap history and staking history buttons',()=>{
            cy.window().then(win => {
                const hasSolanaProvider = Boolean(win.solana)
                cy.log(`Solana provider: ${hasSolanaProvider}`)
            })
            cy.connectWallet()
            cy.get('h2').contains('Terms & Conditions').should('be.visible')
            cy.get('span').contains('I have read and accept the Terms and Conditions.').should('be.visible').as('checkbox')
            cy.get('@checkbox').click()
            cy.get('@checkbox').prev().should('be.checked')
            cy.get('button').contains('Confirm').should('be.visible').click()
            cy.get('.min-\\[1324px\\]\\:flex.-mt-3 > .flex-wrap > :nth-child(4) > .cursor-pointer').click();
            cy.get('div').contains('Transaction history').should('be.visible')
            cy.get('button').contains('Swap').should('be.visible')
            cy.get('button').contains('Staking').should('be.visible')
        })
    })
    describe('ProgressBar component tests', () => {
        it('ProgressBar container is visible with correct styling', () => {
            cy.get('div.h-full.hidden.relative.mb-3.max-h-\\[150px\\].md\\:max-h-\\[124px\\].border-white\\/\\[0\\.15\\].w-full.sm\\:w-\\[520px\\].lxl\\:w-full.min-\\[2100px\\]\\:w-\\[632px\\].rounded-\\[12px\\].shadow-whiteShadow2.px-5.min-\\[480px\\]\\:px-\\[24px\\].py-\\[14px\\].sm\\:flex.flex-col.gap-3.font-spider.tracking-wider.border-\\[1px\\].bg-black\\/50.backdrop-blur-\\[3px\\]')
                .should('be.visible')
                .should('have.css', 'border-radius', '12px')
                .should('have.css', 'background-color', 'rgba(0, 0, 0, 0.5)')
        })

        it('ProgressBar contains info icon and description', () => {
            cy.get('div.h-full.hidden.relative.mb-3.max-h-\\[150px\\].md\\:max-h-\\[124px\\].border-white\\/\\[0\\.15\\].w-full.sm\\:w-\\[520px\\].lxl\\:w-full.min-\\[2100px\\]\\:w-\\[632px\\].rounded-\\[12px\\].shadow-whiteShadow2.px-5.min-\\[480px\\]\\:px-\\[24px\\].py-\\[14px\\].sm\\:flex.flex-col.gap-3.font-spider.tracking-wider.border-\\[1px\\].bg-black\\/50.backdrop-blur-\\[3px\\]')
                .find('img.w-\\[20px\\]')
                .should('be.visible')
                .should('have.attr', 'src', '/info.svg')
                .should('have.attr', 'alt', 'info-icon')
            
            cy.get('h1.text-white.font-normal.text-\\[12px\\]')
                .should('be.visible')
                .should('have.css', 'color', 'rgb(255, 255, 255)')
        })

        it('ProgressBar displays points correctly', () => {
            cy.get('div.text-\\[10px\\].w-full.text-\\[white\\]\\/\\[0\\.5\\]')
                .should('be.visible')
                .should('have.css', 'color', 'rgba(255, 255, 255, 0.5)')
            
            cy.get('div.text-\\[\\#FFC34E\\].text-\\[14px\\]')
                .should('be.visible')
                .should('have.css', 'color', 'rgb(255, 195, 78)')
        })

        it('ProgressBar shows correct level bar based on points', () => {
            // Verificar que se muestre BronzeBar cuando los puntos son menores a 201
            cy.get('div.h-full.hidden.relative.mb-3.max-h-\\[150px\\].md\\:max-h-\\[124px\\].border-white\\/\\[0\\.15\\].w-full.sm\\:w-\\[520px\\].lxl\\:w-full.min-\\[2100px\\]\\:w-\\[632px\\].rounded-\\[12px\\].shadow-whiteShadow2.px-5.min-\\[480px\\]\\:px-\\[24px\\].py-\\[14px\\].sm\\:flex.flex-col.gap-3.font-spider.tracking-wider.border-\\[1px\\].bg-black\\/50.backdrop-blur-\\[3px\\]')
                .should('be.visible')
                .should('contain', 'Bronze')
        })
    })
    describe('Footer swap  tests',()=>{
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
    describe('Swap component tests', () => {
        beforeEach(() => {
            cy.clearLocalStorage()
            cy.clearCookies()
            cy.viewport(1920, 1080)
            cy.visit('/')
            cy.connectWallet()
        })
        it('Swap component is visible', () => {
            cy.get('.relative.border-white\\/\\[0\\.10\\].2xl\\:max-w-\\[632px\\].sm\\:max-w-\\[520px\\].max-w-\\[100\\%\\].rounded-\\[12px\\].w-\\[100\\%\\].shadow-whiteShadow2.px-4.sm\\:px-\\[24px\\].py-\\[3px\\].sm\\:py-\\[16px\\].flex.flex-col.gap-3.font-spider.tracking-wider.border-\\[1px\\].bg-black\\/50.backdrop-blur-\\[3px\\]').should('be.visible')
        })
    
        it('Swap contains progress bar',()=>{
            cy.get('div.h-full.hidden.relative.mb-3.max-h-\\[150px\\].md\\:max-h-\\[124px\\].border-white\\/\\[0\\.15\\].w-full.sm\\:w-\\[520px\\].lxl\\:w-full.min-\\[2100px\\]\\:w-\\[632px\\].rounded-\\[12px\\].shadow-whiteShadow2.px-5.min-\\[480px\\]\\:px-\\[24px\\].py-\\[14px\\].sm\\:flex.flex-col.gap-3.font-spider.tracking-wider.border-\\[1px\\].bg-black\\/50.backdrop-blur-\\[3px\\]')
                    .should('be.visible')
                    .should('have.css', 'border-radius', '12px')
                    .should('have.css', 'background-color', 'rgba(0, 0, 0, 0.5)').should('exist')
        })
    
        it('First token selection works correctly, search and select', () => {
            cy.get('.flex.items-center.gap-2.sm\\:gap-3.cursor-pointer.hover\\:shadow-glowShadow.bg-\\[\\#262626\\].border-\\[1px\\].px-1.sm\\:px-\\[10px\\].py-\\[2px\\].sm\\:py-\\[8px\\].rounded-\\[8px\\]').first().click()
            cy.get('#search-token').clear();
            cy.get('#search-token').type('usdt');
            cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click();
        })
        it('First token Input field is visible and has correct value', () => {
            cy.get('.w-4\\/5.p-2.font-satoshi.text-white.focus\\:outline-none.text-\\[16px\\].sm\\:text-\\[20px\\].bg-\\[\\#000\\].text-right').type('1')
            cy.get('.w-4\\/5.p-2.font-satoshi.text-white.focus\\:outline-none.text-\\[16px\\].sm\\:text-\\[20px\\].bg-\\[\\#000\\].text-right').should('have.value', '1')
        })
        it('First token Input contains max and half buttons and works correctly', () => {
            /* ==== Generated with Cypress Studio ==== */
            cy.get(':nth-child(1) > .sm\\:flex-row > .min-\\[375px\\]\\:gap-0 > .gap-2 > :nth-child(1)').click();
            cy.get(':nth-child(1) > .sm\\:flex-row > .min-\\[375px\\]\\:gap-0 > .gap-2 > :nth-child(2)').click();
            /* ==== End Cypress Studio ==== */
        })
    
        it('Second token selection works correctly, search and select', () => {
            cy.get('.flex.items-center.gap-2.sm\\:gap-3.cursor-pointer.hover\\:shadow-glowShadow.bg-\\[\\#262626\\].border-\\[1px\\].px-1.sm\\:px-\\[10px\\].py-\\[2px\\].sm\\:py-\\[8px\\].rounded-\\[8px\\]').eq(1).click()
            cy.get('#search-token').clear();
            cy.get('#search-token').type('sol');
            cy.get(':nth-child(1) > .gap-3 > .flex-col > .gap-\\[5px\\] > .text-\\[14px\\]').click();
        })
        it('Second token Input field is visible    ', () => {
            cy.get(':nth-child(3) > .items-end > .w-full > .w-4\\/5').should('be.visible');
            cy.get(':nth-child(3) > .items-end > .w-full > .w-4\\/5').type('1')
        })
        it('Second token Input contains max and half buttons and works correctly', () => {
            cy.get(':nth-child(3) > .sm\\:flex-row > .min-\\[375px\\]\\:gap-0 > .gap-2 > :nth-child(1)').click();
            cy.get(':nth-child(3) > .sm\\:flex-row > .min-\\[375px\\]\\:gap-0 > .gap-2 > :nth-child(2)').click();
        })
    
        it('button toggle token works correctly', () => {
            cy.get('.cursor-pointer.hover\\:shadow-glowShadow.hover\\:border-defaultBeige.flex.items-center.justify-center.absolute.top-\\[49\\%\\].left-\\[50\\%\\].-translate-x-\\[50\\%\\].-translate-y-\\[50\\%\\].sm\\:-translate-y-\\[50\\%\\].h-\\[40px\\].w-\\[40px\\].border-\\[1px\\].border-white\\/\\[0\\.05\\].bg-\\[\\#262626\\].rounded-full.shadow-refreshBoxShadow.backdrop-blur-sm').click()
            cy.get('.flex.items-center.gap-2.sm\\:gap-3.cursor-pointer.hover\\:shadow-glowShadow.bg-\\[\\#262626\\].border-\\[1px\\].px-1.sm\\:px-\\[10px\\].py-\\[2px\\].sm\\:py-\\[8px\\].rounded-\\[8px\\]').first().contains('SOL')
            cy.get('.flex.items-center.gap-2.sm\\:gap-3.cursor-pointer.hover\\:shadow-glowShadow.bg-\\[\\#262626\\].border-\\[1px\\].px-1.sm\\:px-\\[10px\\].py-\\[2px\\].sm\\:py-\\[8px\\].rounded-\\[8px\\]').eq(1).contains('USDT')
            cy.get('.cursor-pointer.hover\\:shadow-glowShadow.hover\\:border-defaultBeige.flex.items-center.justify-center.absolute.top-\\[49\\%\\].left-\\[50\\%\\].-translate-x-\\[50\\%\\].-translate-y-\\[50\\%\\].sm\\:-translate-y-\\[50\\%\\].h-\\[40px\\].w-\\[40px\\].border-\\[1px\\].border-white\\/\\[0\\.05\\].bg-\\[\\#262626\\].rounded-full.shadow-refreshBoxShadow.backdrop-blur-sm').click()
        })
    
        it('Gasless option can be toggled', () => {
            cy.get('span.text-\\[9px\\].sm\\:text-\\[12px\\]').click()
            cy.get('span.bg-solanaGreen.shadow-greenShadow.rounded-full.w-2.h-2').should('be.visible')
            
            
        })
    
        it('Share button copies swap information', () => {
            cy.get('.gap-2 > div.flex.gap-3 > .cursor-pointer').click();
            cy.window().then((win) => {
                win.navigator.clipboard.readText().then((text) => {
                    cy.log(text)
                })
            })
        })
        it('Swap tutorial contains all/10 steps and works correctly',()=>{
            /* ==== Generated with Cypress Studio ==== */
            cy.get('[d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99zM13 12.49v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24-1.7 0-3.24.3-4.5.83zM17.5 14.33c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99.88 0 1.73.09 2.5.26v-1.52c-.79-.16-1.64-.24-2.5-.24z"]').click();
            cy.get('.items-center > .bg-white').click();
            cy.get('.bg-\\[\\#000\\] > .items-center > :nth-child(2)').click();
            cy.get('.lg\\:w-\\[250px\\] > .items-center > :nth-child(2)').click();
            cy.get('.bg-\\[\\#000\\] > .items-center > :nth-child(2)').click();
            cy.get('.lg\\:w-\\[250px\\] > .items-center > :nth-child(2)').click();
            cy.get('.lg\\:w-\\[250px\\] > .items-center > :nth-child(2)').click();
            cy.get('.lg\\:w-\\[250px\\] > .items-center > :nth-child(2)').click();
            cy.get('.lg\\:w-\\[250px\\] > .items-center > :nth-child(2)').click();
            cy.get('.bg-\\[\\#000\\]\\/\\[0\\.9\\] > .items-center > :nth-child(2)').click();
            cy.get('.lg\\:w-\\[250px\\] > .items-center > :nth-child(2)').click();
            /* ==== End Cypress Studio ==== */
        })
        describe('Swap slippage settings',()=>{
            it('Slippage settings can be opened', () => {
                /* ==== Generated with Cypress Studio ==== */
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
            })
            it("Slippage settings contains 0.1% and correct works",()=>{
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
                cy.get('.relative.justify-center > :nth-child(1)').click();
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
                cy.get('#search-token').should('have.value', '0.1')
            })
            it("Slippage settings contains 0.5% and correct works",()=>{
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
                cy.get('.absolute.top-\\[38px\\].left-\\[0px\\].backdrop-blur-\\[30px\\].shadow-activeBtnShadow.max-w-\\[280px\\].rounded-xl.flex.p-5.sm\\:p-6.flex-col.gap-4.sm\\:gap-4.w-\\[90\\%\\].sm\\:w-full.z-\\[999\\].bg-\\[\\#000\\]').should('be.visible')
                cy.get('.relative.justify-center > :nth-child(2)').click();
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
                cy.get('#search-token').should('have.value', '0.5')
            })
            it("Slippage settings contains 1% and correct works",()=>{
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
                cy.get('.absolute.top-\\[38px\\].left-\\[0px\\].backdrop-blur-\\[30px\\].shadow-activeBtnShadow.max-w-\\[280px\\].rounded-xl.flex.p-5.sm\\:p-6.flex-col.gap-4.sm\\:gap-4.w-\\[90\\%\\].sm\\:w-full.z-\\[999\\].bg-\\[\\#000\\]').should('be.visible')
                cy.get('.relative.justify-center > :nth-child(3)').click();
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
                cy.get('#search-token').should('have.value', '1')
            })
            it("Slippage Settings can be opened and closed",()=>{
                cy.get('.flex.gap-3.cursor-pointer > .text-white\\/\\[0\\.6\\]').click();
                cy.get('.absolute.top-\\[38px\\].left-\\[0px\\].backdrop-blur-\\[30px\\].shadow-activeBtnShadow.max-w-\\[280px\\].rounded-xl.flex.p-5.sm\\:p-6.flex-col.gap-4.sm\\:gap-4.w-\\[90\\%\\].sm\\:w-full.z-\\[999\\].bg-\\[\\#000\\]').should('be.visible')
                cy.get('.font-satoshi > .text-lg').click();
                cy.get('.absolute.top-\\[38px\\].left-\\[0px\\].backdrop-blur-\\[30px\\].shadow-activeBtnShadow.max-w-\\[280px\\].rounded-xl.flex.p-5.sm\\:p-6.flex-col.gap-4.sm\\:gap-4.w-\\[90\\%\\].sm\\:w-full.z-\\[999\\].bg-\\[\\#000\\]').should('not.exist')
            })
        
        })
        describe('CircularTimer component tests', () => {
            beforeEach(() => {
                cy.clearLocalStorage()
                cy.clearCookies()
                cy.viewport(1920, 1080)
                cy.visit('/')
                cy.connectWallet()
            })
        
            it('CircularTimer is visible with correct dimensions', () => {
                cy.get('svg.w-\\[16px\\].sm\\:w-\\[20px\\].h-\\[16px\\].sm\\:h-\\[20px\\]')
                    .should('be.visible')
                    .should('have.attr', 'width', '22')
                    .should('have.attr', 'height', '22')
                    .should('have.attr', 'viewBox', '0 0 120 120')
            })
        
            it('CircularTimer contains two circles with correct styling', () => {
                cy.get('svg.w-\\[16px\\].sm\\:w-\\[20px\\].h-\\[16px\\].sm\\:h-\\[20px\\]')
                    .find('circle')
                    .should('have.length', 2)
                    .first()
                    .should('have.attr', 'stroke', '#262626')
                    .should('have.attr', 'stroke-width', '15')
                    .should('have.attr', 'fill', 'none')
                
                cy.get('svg.w-\\[16px\\].sm\\:w-\\[20px\\].h-\\[16px\\].sm\\:h-\\[20px\\]')
                    .find('circle')
                    .last()
                    .should('have.attr', 'stroke', '#EABC8F')
                    .should('have.attr', 'stroke-width', '15')
                    .should('have.attr', 'fill', 'none')
                    .should('have.attr', 'style')
                    .and('include', 'transition: stroke-dashoffset 0.2s linear')
            })
        
            it('CircularTimer can be clicked and loading animation appears', () => {
                cy.get('svg.w-\\[16px\\].sm\\:w-\\[20px\\].h-\\[16px\\].sm\\:h-\\[20px\\]')
                    .should('be.visible')
                    .should('have.attr', 'width', '22')
                    .should('have.attr', 'height', '22')
                    .should('have.attr', 'viewBox', '0 0 120 120').click()
        
                cy.get('div[aria-label="Loading..."]').should('be.visible')
            })
        })
    })
    describe.skip('Swap Container Graph and New Pairs Section', () => {


        it('should display the Graph when the Graph button is clicked', () => {
            cy.get('[title="Chart"] > .cursor-pointer').click();
            cy.get('.rounded-\\[8px\\].text-\\[11px\\].font-bold.hover\\:bg-white\\/10.hover\\:text-defaultBeige.font-satoshi.uppercase.tracking-\\[2px\\].py-\\[10px\\].bg-white\\/10.text-defaultBeige')
            .contains('GRAPH')
            .should('be.visible')
            .click();
            cy.get('.border-2.border-white\\/\\[0\\.10\\].rounded-\\[12px\\].w-\\[100\\%\\].shadow-whiteShadow2.flex.flex-col.gap-5.tracking-wider.backdrop-blur-\\[3px\\]')
            .should('be.visible')
        });

        it.only('should display the New Pairs when the New Pairs button is clicked', () => {
            cy.get('[title="Chart"] > .cursor-pointer').click();

            cy.get('.rounded-\\[8px\\].text-\\[11px\\].font-bold.font-satoshi.hover\\:bg-white\\/10.hover\\:text-defaultBeige.uppercase.tracking-\\[2px\\].py-\\[10px\\].bg-\\[transparent\\].text-white\\/\\[0\\.5\\]')
            .contains('NEW PAIRS')
            .should('be.visible')
            .click();

        });

        it('should toggle between Graph and New Pairs', () => {
            // Haz clic en el botón de Graph y verifica que el Graph esté visible
            cy.get('button').contains('Graph').click();
            cy.get('div').contains('Graph').should('be.visible');

            // Haz clic en el botón de New Pairs y verifica que el CoinTable esté visible
            cy.get('button').contains('New Pairs').click();
            cy.get('div').contains('CoinTable').should('be.visible');
        });
    });
})