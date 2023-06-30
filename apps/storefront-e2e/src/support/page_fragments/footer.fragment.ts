export class FooterFragment {
  getWrapper = () => cy.get('[uid="footer"]');

  getLinkByUrl = (url: string) =>
    this.getWrapper().find('oryx-text').find(`a[href*="${url}"]`);
}
