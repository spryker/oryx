import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { LoginPageComponent } from './login.component';
import { loginPageComponent } from './login.def';

describe('LoginPageComponent', () => {
  let element: LoginPageComponent;

  beforeAll(async () => {
    await useComponent([loginPageComponent]);
  });

  beforeEach(async () => {
    element = await fixture(html`<oryx-login-page></oryx-login-page`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render auth login', () => {
    expect(element).toContainElement('oryx-auth-login');
  });

  it('should render logo', () => {
    expect(element).toContainElement('oryx-image');
  });

  it('should render welcome message', () => {
    expect(element).toContainElement('oryx-heading');
  });
});
