const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  fileServerFolder: '.',
  fixturesFolder: './src/fixtures',
  modifyObstructiveCode: false,
  watchForFileChanges: false,
  video: true,
  videosFolder: '../../dist/cypress/apps/storefront-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/storefront-e2e/screenshots',
  chromeWebSecurity: false,
  includeShadowDom: true,
  viewportWidth: 1024,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./src/plugins/index.ts')(on, config);
    },
    baseUrl: 'http://localhost:3001',
    specPattern: './src/integration/*.cy.{js,jsx,ts,tsx}',
    supportFile: './src/support/index.ts',
    fixturesFolder: './src/fixtures',
  },
  env: {
    SCOS_BASE_URL: process.env.SCOS_BASE_URL,
  },
});
