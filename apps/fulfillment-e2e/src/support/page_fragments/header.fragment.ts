export class HeaderFragment {
  getWrapper = () => cy.get('oryx-picking-header');

  getUserIcon = () => this.getWrapper().find('oryx-site-navigation-item');
}
