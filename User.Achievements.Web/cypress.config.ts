import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx,feature}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // For Cucumber integration
      const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
      const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
      const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');

      // This is required for the preprocessor to generate JSON reports after each run
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin.default(config)],
      }));

      // Make the cucumber preprocessor aware of cucumber json file output location
      preprocessor.addCucumberPreprocessorPlugin(on, config);

      return config;
    },
  },
});
