const { defineConfig } = require('cypress');
const config = require('./cypress.config');

module.exports = defineConfig({
  ...config,
  projectId: 'bxiyv4',
  retries: 1,
  // e2e: {
  //   ...config.e2e,
  //   // prod preview is run on 4173 port
  //   baseUrl: 'http://localhost:4173',
  // },
});
