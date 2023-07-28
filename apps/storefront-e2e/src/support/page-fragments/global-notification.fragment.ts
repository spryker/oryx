export class GlobalNotification {
  private wrapper: HTMLElement;

  constructor(wrapper) {
    this.wrapper = wrapper;
  }

  getWrapper = () => cy.wrap(this.wrapper);
  getSubtext = () => this.getWrapper().find('span[slot="subtext"]');
  getCloseBtn = () => this.getWrapper().find('oryx-button');
  getType = () => this.getWrapper().invoke('attr', 'type');
}
