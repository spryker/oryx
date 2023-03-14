// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
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

const origLog = Cypress.log;

// removes useless log messages from cypress runner
Cypress.log = function (opts: any, ...other) {
  if (opts.url && (opts.url.includes('google') || opts.url.includes('youtube'))) {
    return;
  }

  return origLog(opts, ...other);
};