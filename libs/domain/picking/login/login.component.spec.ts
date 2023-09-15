import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { PickingLoginPageComponent } from './login.component';
import { pickingLoginPageComponent } from './login.def';

describe('LoginPageComponent', () => {
  let element: PickingLoginPageComponent;

  beforeAll(async () => {
    await useComponent([pickingLoginPageComponent]);
  });

  beforeEach(async () => {
    element = await fixture(html`<oryx-picking-login></oryx-picking-login`);
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
