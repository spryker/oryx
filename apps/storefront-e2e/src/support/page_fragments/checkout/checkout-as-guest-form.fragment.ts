export class CheckoutAsGuestFormFragment {
  getWrapper = () => cy.get('oryx-checkout-account');
  getEmailInput = () => this.getWrapper().find('[name="email"]');

  fillForm = () => {
    this.getEmailInput().type('test@test.test');
  };
}
