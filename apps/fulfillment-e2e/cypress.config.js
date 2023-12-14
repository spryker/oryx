const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  watchForFileChanges: false,
  video: true,
  videosFolder: '../../dist/cypress/apps/fulfillment-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/fulfillment-e2e/screenshots',
  chromeWebSecurity: false,
  includeShadowDom: true,
  pageLoadTimeout: 180000,
  viewportWidth: 414,
  viewportHeight: 844,
  redirectionLimit: 100,
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: './src/integration/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
    experimentalOriginDependencies: true,
  },
  env: {
    glueApiUrl: 'https://api.de.demo-picking-app.cloud.spryker.toys',
    backofficeUrl: 'https://backoffice.de.demo-picking-app.cloud.spryker.toys',
    backofficeApiUrl:
      'https://backend-api.de.demo-picking-app.cloud.spryker.toys',
  },
});
