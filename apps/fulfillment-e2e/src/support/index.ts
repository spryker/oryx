// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import registerCypressGrep from '@cypress/grep/src/support';
import './commands';

registerCypressGrep();

Cypress.on('uncaught:exception', (err) => {
  const ignoreErrors = [
    'Registration failed - push service not available',
    'Background Sync is disabled',
  ];

  if (ignoreErrors.some((ignoreError) => err.message.includes(ignoreError))) {
    return false;
  }
});
