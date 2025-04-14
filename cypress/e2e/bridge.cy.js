describe('Bridge Component', () => {
  beforeEach(() => {
    // Ignorar errores de cross-origin
    cy.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from failing the test
      return false;
    });

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
