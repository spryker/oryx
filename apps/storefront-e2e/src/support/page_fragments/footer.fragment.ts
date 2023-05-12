export class FooterFragment {
  getWrapper = () => cy.get('[uid="footer"]');

  getLink = (url: string) =>
    this.getWrapper().find('oryx-content-link').find(`a[href*="${url}"]`);
}
