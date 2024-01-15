export function visibilityCheck(
  element: Cypress.Chainable<JQuery<HTMLElement>>
): Cypress.Chainable<JQuery<HTMLElement>> {
  //top -100 to compensate the sticky header's height
  return element
    .scrollIntoView({ offset: { top: -100, left: 0 } })
    .should('be.visible');
}
