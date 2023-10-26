const { defineConfig } = require('cypress');
const config = require('./cypress.config');

module.exports = defineConfig({
  ...config,
  projectId: 'bxiyv4',
  retries: 1,
});
