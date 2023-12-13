import './commands';

Cypress.on('uncaught:exception', (err) => {
  const ignoreErrors = [
    // fa error
    'Registration failed - push service not available',
    'Background Sync is disabled',
    // zed order page error
    "Cannot read properties of undefined (reading 'scrollHeight')",
  ];

  if (ignoreErrors.some((ignoreError) => err.message.includes(ignoreError))) {
    return false;
  }
});
