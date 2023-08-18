import registerCypressGrep from '@cypress/grep/src/support';
import './commands';
import { Customer } from './types/user.type';

registerCypressGrep();

const removeUselessLogsFromCypressLogs = () => {
  const origLog = Cypress.log;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Cypress.log = function (opts: any, ...other) {
    if (opts.url) {
      // this request is being intercepted
      // and this log prevents Cypress bug with missing log on interceptor
      if (opts.url.includes('/youtubei/v1/next')) {
        return origLog(opts, ...other);
      }

      if (opts.url.includes('google') || opts.url.includes('youtube')) {
        return;
      }
    }

    return origLog(opts, ...other);
  };

  cy.log('Useless logs filterring is applied');
};

const getRandomCustomer = () => {
  cy.fixture('users').then((users: Customer[]) => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const path = './src/fixtures/test-customer.json';

    cy.writeFile(path, JSON.stringify(randomUser));
  });
};

export const isB2B = (): boolean => {
  return Cypress.env('IS_B2B');
};

before(() => {
  removeUselessLogsFromCypressLogs();
  getRandomCustomer();
});
