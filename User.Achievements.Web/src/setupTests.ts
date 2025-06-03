// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import '@testing-library/jest-dom'

// Set up environment variables for tests
process.env.VITE_API_URL = 'http://localhost:5000'
process.env.MODE = 'test'
