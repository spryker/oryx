import './commands';
import { SCCOSApi } from './sccos_api/sccos.api';
import registerCypressGrep from '@cypress/grep/src/support';

registerCypressGrep();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createAUserBeforeTestsAreRun = () => {
  const api = new SCCOSApi();
  const email = `test-user-${Math.random()}@spryker.com`;

  api.customer.post({
    data: {
      type: 'customers',
      attributes: {
        firstName: 'Test',
        lastName: 'User',
        salutation: 'Mr',
        gender: 'Male',
        email,
        password: 'change123',
        confirmPassword: 'change123',
        acceptedTerms: true,
      },
    },
  });

  cy.wrap({
    email,
    password: 'change123',
    name: 'Test',
  }).as('testCustomer');
};

const removeUselessLogsFromCypressLogs = () => {
  const origLog = Cypress.log;

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
  const customers = [
    {
      id: 'DE--1',
      name: 'Spencor',
      email: 'spencor.hopkin@spryker.com',
      password: 'change123',
    },
    {
      id: 'DE--2',
      name: 'Maria',
      email: 'maria.williams@spryker.com',
      password: 'change123',
    },
    {
      id: 'DE--3',
      name: 'Maggie',
      email: 'maggie.may@spryker.com',
      password: 'change123',
    },
    {
      id: 'DE--8',
      name: 'Andrew',
      email: 'andrew@ottom.de',
      password: 'change123',
    },
    {
      id: 'DE--10',
      name: 'Alexa',
      email: 'Alexa@ottom.de',
      password: 'change123',
    },
    {
      id: 'DE--13',
      name: 'Kim',
      email: 'Kim@ottom.de',
      password: 'change123',
    },
    {
      id: 'DE--15',
      name: 'Armando',
      email: 'Richi@spryker.com',
      password: 'change123',
    },
    {
      id: 'DE--19',
      name: 'Donald',
      email: 'donald@spryker.com',
      password: 'change123',
    },
    {
      id: 'DE--31',
      name: 'Arnold',
      email: 'arnold@spryker.com',
      password: 'change123',
    },
    {
      id: 'DE--33',
      name: 'Kevin',
      email: 'kevin@spryker.com',
      password: 'change123',
    },
  ];

  const randomCustomer =
    customers[Math.floor(Math.random() * customers.length)];
  cy.writeFile(
    './src/fixtures/test-customer.json',
    JSON.stringify(randomCustomer)
  );
};

before(() => {
  removeUselessLogsFromCypressLogs();
  // customer creation is blocked by BE error
  // that's why we will use random customers which is not perfect
  // but will resolve our concurency issue in 95% of cases
  //
  // TODO: uncomment when BE issue is fixed, and remove randomizer
  // createAUserBeforeTestsAreRun()
  getRandomCustomer();
});
