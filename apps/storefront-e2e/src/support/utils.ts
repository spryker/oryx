export function visibilityCheck(
  element: Cypress.Chainable<JQuery<HTMLElement>>
): void {
  //top -100 to compensate the sticky header's height
  element
    .scrollIntoView({ offset: { top: -100, left: 0 } })
    .should('be.visible');
}
