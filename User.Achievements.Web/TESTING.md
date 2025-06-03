# Frontend Testing Guide

This guide explains how to run the tests for the User Achievements Web frontend application.

## Testing Setup

The project uses the following testing tools:

- **Jest + React Testing Library** - For unit testing React components and services
- **Cypress** - For end-to-end testing
- **Cucumber** - For BDD-style tests integrated with Cypress

## Running Unit Tests

Unit tests are written using Jest and React Testing Library. They test individual components and services in isolation.

```bash
# Run all unit tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

### Unit Test Structure

Unit tests are located in the `src/__tests__` directory, mirroring the structure of the source code:

- `src/__tests__/components/` - Tests for React components
- `src/__tests__/services/` - Tests for API services

## Running End-to-End Tests

End-to-end tests are written using Cypress and Cucumber. They test the application as a whole, simulating user interactions in a real browser.

```bash
# Open Cypress test runner
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

### E2E Test Structure

End-to-end tests are located in the `cypress/e2e` directory:

- `cypress/e2e/features/` - Cucumber feature files
- `cypress/e2e/step_definitions/` - Step definitions for Cucumber features

## Writing Tests

### Unit Tests

Example of a service test:

```typescript
describe('userService', () => {
  describe('getAllUsersAsync', () => {
    it('should fetch all users successfully', async () => {
      // Arrange
      mockAxiosGet.mockResolvedValueOnce({ data: mockUsers });

      // Act
      const result = await userService.getAllUsersAsync();

      // Assert
      expect(mockAxiosGet).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });
  });
});
```

Example of a component test:

```typescript
describe('UserList Component', () => {
  it('renders user list after loading', async () => {
    render(<UserList />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

Example of a Cucumber feature:

```gherkin
Feature: User List
  Scenario: View all users
    Given I am on the user list page
    Then I should see a list of users
```

Example of step definitions:

```typescript
Given('I am on the user list page', () => {
  cy.visit('/');
});

Then('I should see a list of users', () => {
  cy.get('[data-testid="user-list-item"]').should('have.length.at.least', 1);
});
```

## Best Practices

1. **Test Coverage**: Aim for high test coverage, especially for critical paths
2. **Isolation**: Unit tests should be isolated and not depend on external services
3. **Mocking**: Use mocks for external dependencies like API calls
4. **Data Attributes**: Use `data-testid` attributes for selecting elements in tests
5. **BDD**: Write E2E tests in a behavior-driven style using Gherkin syntax
