module.exports = {
  nonGlobalStepDefinitions: true,
  stepDefinitions: 'cypress/e2e/step_definitions/',
  cucumberJson: {
    generate: true,
    outputFolder: 'cypress/cucumber-json',
    filePrefix: '',
    fileSuffix: '.cucumber'
  }
};
