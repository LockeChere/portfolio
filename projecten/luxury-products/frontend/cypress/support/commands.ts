Cypress.Commands.add('login', (email = 'testuser@example.com', password = 'wachtwoord123') => {
  cy.visit('http://localhost:4200/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('include', '/cart');
});
