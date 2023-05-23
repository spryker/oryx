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
import './commands';

Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Registration failed - push service not available')
  ) {
    // Ignore the 'push service not available' error
    return false;
  }
  // Throw any other uncaught exceptions
});
