/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command om in te loggen met optionele email en wachtwoord.
     * @example cy.login('email@example.com', 'wachtwoord')
     */
    login(email?: string, password?: string): Chainable<void>;
  }
}
