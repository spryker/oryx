export class CheckoutContactFragment {
  getWrapper = () => cy.get('oryx-checkout-contact');
  getEmailInput = () => this.getWrapper().find('[name="email"]');
  getFirstNameInput = () => this.getWrapper().find('[name="firstName"]');
  getLastNameInput = () => this.getWrapper().find('[name="lastName"]');

  fillContactForm = () => {
    this.getFirstNameInput().type('Test');
    this.getLastNameInput().type('User');
    this.getEmailInput().type('test@test.test');
  };
}
