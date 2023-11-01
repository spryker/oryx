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
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    baseUrl: 'http://localhost:4200',
    specPattern: './src/integration/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
  },
  env: {
    glueApiUrl: 'https://glue.de.faas-suite-prod.cloud.spryker.toys',
    ORYX_FULFILLMENT_BACKEND_URL: process.env.ORYX_FULFILLMENT_BACKEND_URL,
    ORYX_FULFILLMENT_CLIENT_ID: process.env.ORYX_FULFILLMENT_CLIENT_ID,
  },
});
