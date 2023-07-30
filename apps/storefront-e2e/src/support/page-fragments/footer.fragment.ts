export class FooterFragment {
  getWrapper = () => cy.get('[route="/_footer"]');
  getLinkByUrl = (url: string) =>
    this.getWrapper().find('oryx-text').find(`a[href*="${url}"]`);
}
