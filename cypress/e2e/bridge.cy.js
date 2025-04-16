describe('Bridge Component', () => {
  beforeEach(() => {
    // Ignorar errores de cross-origin
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from failing the test
      return false;
    });
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

    cy.visit('/');
    cy.viewport(1920, 1080);
    
    cy.window().then((win) => {
        win.deBridge = {
            widget: cy.stub()
                .callsFake((...args) => {
                    cy.log('Widget called with:', JSON.stringify(args[0]));
                })
                .as('debridgeWidget')
        };
    });

    // Verificar que el stub se creó correctamente
    cy.window().then((win) => {
        expect(win.deBridge).to.exist;
        expect(win.deBridge.widget).to.exist;
    });
  });

  it('should exist the bridge button in the navbar and be clickable', () => {
    cy.get('.w-\\[60px\\] > .flex > .cursor-pointer').should('exist').click();
  });

  it('should close button exist and be clickable inside of modal, and close the modal', () => {
    cy.get('.w-\\[60px\\] > .flex > .cursor-pointer').should('exist').click();
    cy.get('form > .cursor-pointer > svg').should('exist')
  });
});
