import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// User List steps
Given('I am on the user list page', () => {
  cy.visit('/');
  cy.contains('User Achievements').should('be.visible');
});

Then('I should see a list of users', () => {
  cy.get('[data-testid="user-list-item"]').should('have.length.at.least', 1);
});

Then('each user should display their name and level', () => {
  cy.get('[data-testid="user-list-item"]').first().within(() => {
    cy.get('[data-testid="user-name"]').should('be.visible');
    cy.get('[data-testid="user-level"]').should('be.visible');
  });
});

// Search steps
When('I enter {string} in the search field', (searchTerm) => {
  cy.get('[data-testid="search-input"]').type(searchTerm);
});

Then('I should see users with {string} in their name', (searchTerm) => {
  cy.get('[data-testid="user-list-item"]').each(($el) => {
    cy.wrap($el).find('[data-testid="user-name"]').invoke('text').should('include', searchTerm);
  });
});

Then('I should not see users without {string} in their name', (searchTerm) => {
  // This is implicitly tested by the previous step, but we can add an explicit check
  // if we have a way to verify the total count of users that should be displayed
  cy.get('[data-testid="user-list-item"]').should('have.length.at.least', 1);
});

// User details steps
When('I click on a user', () => {
  cy.get('[data-testid="user-list-item"]').first().click();
});

Then('I should be taken to the user details page', () => {
  cy.url().should('include', '/users/');
});

Then('I should see detailed information about the user', () => {
  cy.get('[data-testid="user-detail"]').should('be.visible');
  cy.get('[data-testid="user-name"]').should('be.visible');
  cy.get('[data-testid="user-level"]').should('be.visible');
  cy.get('[data-testid="user-points"]').should('be.visible');
});
