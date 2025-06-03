// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to mock API responses
Cypress.Commands.add('mockUserApi', () => {
  cy.intercept('GET', '*/users', {
    statusCode: 200,
    body: [
      { id: 1, name: 'John Doe', points: 100, level: 'Beginner', nextLevelPoints: 200 },
      { id: 2, name: 'Jane Smith', points: 250, level: 'Intermediate', nextLevelPoints: 500 },
      { id: 3, name: 'Bob Johnson', points: 550, level: 'Advanced', nextLevelPoints: 1000 }
    ]
  }).as('getUsers');

  cy.intercept('GET', '*/users/*', {
    statusCode: 200,
    body: { id: 1, name: 'John Doe', points: 100, level: 'Beginner', nextLevelPoints: 200 }
  }).as('getUser');
});
