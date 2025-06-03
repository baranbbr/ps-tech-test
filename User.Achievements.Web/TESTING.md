# Frontend Testing

## Testing Setup

The project uses Jest + React Testing Library for unit testing.

## Running Unit Tests

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
