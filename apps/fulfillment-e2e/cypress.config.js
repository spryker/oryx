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
    glueApiUrl: 'https://glue.de.spryker-b2c.cloud.spryker.toys',
    backofficeUrl: 'http://backoffice.de.spryker-b2c.cloud.spryker.toys',
    backofficeApiUrl:
      'https://glue-backend.de.spryker-b2c.cloud.spryker.toys',
  },
});
