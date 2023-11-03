import './cy-actions/api.actions';
import './cy-actions/cart.actions';
import './cy-actions/checkout.actions';
import './cy-actions/login.actions';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      hydrateElement(assetPath: string, triggerHydrationFn): Chainable<void>;
      checkCurrencyFormatting(locale: string): void;
    }
  }
}

Cypress.Commands.add(
  'hydrateElement',
  (assetPath: string, triggerHydrationFn) => {
    if (Cypress.env('isSSR')) {
      cy.intercept(assetPath).as(`${assetPath}Request`);
      triggerHydrationFn();
      cy.wait(`@${assetPath}Request`);

      // wait till hydrated elements are re-rendered
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(500);
    }
  }
);

Cypress.Commands.add(
  'checkCurrencyFormatting',
  { prevSubject: true },
  (subject, locale: 'en' | 'de') => {
    switch (locale) {
      case 'en':
        return checkCurrencyFormatting(subject, 'start');
      case 'de':
        return checkCurrencyFormatting(subject, 'end');
    }
  }
);

function checkCurrencyFormatting(
  subject,
  expectedSignPosition: 'start' | 'end'
) {
  cy.wrap(subject)
    .invoke('text')
    .then((price) => {
      const symbolPosition = price.indexOf('€');

      if (expectedSignPosition === 'start') expect(symbolPosition).to.eq(0);

      if (expectedSignPosition === 'end')
        expect(symbolPosition).to.eq(price.length - 1);
    });
}
