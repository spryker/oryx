import './cy-actions/api.actions';
import './cy-actions/cart.actions';
import './cy-actions/checkout.actions';
import './cy-actions/login.actions';
import { isPercyEnabled, isSSREnabled } from './index';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      hydrateElement(assetPath: string, triggerHydrationFn): Chainable<void>;
      checkCurrencyFormatting(locale: string): void;
      takeScreenshot(name: string, options?: object): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  'hydrateElement',
  (assetPath: string, triggerHydrationFn) => {
    if (isSSREnabled()) {
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

Cypress.Commands.add(
  'takeScreenshot',
  (
    name: string,
    options = {
      widths: [1024],
      enableJavaScript: true,
    }
  ) => {
    if (isPercyEnabled()) {
      fixSSRRenderedTemplate();

      cy.percySnapshot(name, options);
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

      if (expectedSignPosition === 'start') {
        expect(symbolPosition).to.eq(0);
      }

      if (expectedSignPosition === 'end') {
        expect(symbolPosition).to.eq(price.length - 1);
      }
    });
}

function fixSSRRenderedTemplate() {
  cy.window().then((win) => {
    //wait till async stuff build a template
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(3000);
    processCustomComponent(win.document.body);
  });
}

//theme plugin is applying styles to the components
//that hide all elements that are not hydratable or defined
//the fix adds "hydratable" attribute to all custom components
//to make them visible on percy snapshot
function processCustomComponent(node: Element): void {
  if (node.tagName.toLowerCase().startsWith('oryx-')) {
    node.toggleAttribute('hydratable', true);
  }

  const children = [
    ...node.querySelectorAll('*'),
    ...(node?.shadowRoot?.querySelectorAll('*') ?? []),
  ];

  children.filter((e) => e.shadowRoot).forEach(processCustomComponent);
}
