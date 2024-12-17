describe('GuardService E2E Tests', () => {
  it('should login successfully', () => {
    cy.visit('http://localhost:4200/login');

    // Simula la entrada del usuario
    cy.get('ion-input[name="email"]').type('pepetapia@gmail.com');
    cy.get('ion-input[name="contra"]').type('pepe1234');
    cy.get('ion-button[type="submit"]').click();

    // Verifica que el usuario haya iniciado sesión correctamente
    cy.url().should('include', '/home'); 
  });

  it('should handle login error', () => {
    cy.visit('http://localhost:4200/login');

    // Simula la entrada del usuario con credenciales incorrectas
    cy.get('ion-input[name="email"]').type('pepetapia@gmail.com');
    cy.get('ion-input[name="contra"]').type('pepotapio1234');
    cy.get('ion-button[type="submit"]').click();

    // Verifica que se muestre un mensaje de error
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'Credenciales incorrectas');
    //presentToast('Credenciales incorrectas'
  });
});