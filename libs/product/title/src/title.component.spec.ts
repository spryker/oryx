import { fixture } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { html } from 'lit';
import '../index';
import { TitleComponent } from './title.component';

describe('Title', () => {
  let element: TitleComponent;

  beforeEach(async () => {
    element = await fixture(html`<product-title code="1"></product-title>`);
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(TitleComponent);
  });

  it('renders internal content', () => {
    const textContent = 'Title 1';
    const heading = element?.shadowRoot?.querySelector('h1');
    expect(heading).to.exist;
    expect(heading?.textContent).to.be.equal(textContent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
