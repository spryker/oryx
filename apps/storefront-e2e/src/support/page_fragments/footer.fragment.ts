export class FooterFragment {
  getWrapper = () => cy.get('[uid="footer"]');

  getLinkByUrl = (url: string) =>
    this.getWrapper().find('oryx-content-link').find(`a[href*="${url}"]`);
}
