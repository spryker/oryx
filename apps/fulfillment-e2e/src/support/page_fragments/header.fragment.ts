export class HeaderFragment {
  getWrapper = () => cy.get('oryx-header');

  getUserIcon = () => this.getWrapper().find('oryx-site-navigation-item');
}
