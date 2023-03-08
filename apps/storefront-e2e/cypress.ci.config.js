const { defineConfig } = require('cypress');
const config = require('./cypress.config');

module.exports = defineConfig({
  ...config,
  projectId: 'eothcy',
  retries: 2,
});
