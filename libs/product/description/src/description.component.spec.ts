import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { ProductDescriptionComponent } from './description.component';

describe('Description', () => {
  let element: ProductDescriptionComponent;

  beforeEach(async () => {
    createInjector({
      providers: MOCK_PRODUCT_PROVIDERS,
    });
    element = await fixture(
      html` <product-description
        sku="1"
        uid="1"
        content="${{ truncateCharacterCount: 100 }}"
      ></product-description>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should is defined', () => {
    expect(element).toBeInstanceOf(ProductDescriptionComponent);
  });

  it('should render internal description', async () => {
    element = await fixture(
      html` <product-description
        sku="6"
        .content="${{ truncateCharacterCount: 10 }}"
      ></product-description>`
    );
    const textDescription = 'Lorem ipsu...';
    const content = element?.shadowRoot?.querySelector('p');
    expect(content).to.exist;
    expect(content?.textContent).toContain(textDescription);
  });

  it('should not render if description is not defined', async () => {
    element = await fixture(
      html` <product-description
        sku="3"
        .content="${{ truncateCharacterCount: 0 }}"
      ></product-description>`
    );
    const textDescription = '';
    const content = element?.shadowRoot?.querySelector('p');
    expect(content).to.exist;
    expect(content?.textContent).toContain(textDescription);
  });

  it('should render button if truncated value more then description', async () => {
    element = await fixture(
      html` <product-description
        sku="1"
        .content="${{ truncateCharacterCount: 100 }}"
      ></product-description>`
    );
    const button = element?.shadowRoot?.querySelector('oryx-button');
    expect(button).not.toBeNull();
  });

  it('should not rendered button if truncated value less then description', async () => {
    element = await fixture(
      html` <product-description sku="4"></product-description>`
    );
    expect(element?.shadowRoot?.querySelector('oryx-button')).to.toBeNull();
  });

  it('should not rendered button if truncated value is not defined', async () => {
    element = await fixture(
      html` <product-description sku="5"></product-description>`
    );
    expect(element?.shadowRoot?.querySelector('oryx-button')).to.toBeNull();
  });

  it('should show full/truncated text depends on toggled state', async () => {
    element = await fixture(
      html` <product-description
        sku="6"
        .content="${{ truncateCharacterCount: 10 }}"
      ></product-description>`
    );
    const descriptionMoreText = 'Lorem ipsu...';
    const descriptionLessText = 'Lorem ipsum dolor sit amet.';
    const button = element?.shadowRoot?.querySelector('button');
    expect(element?.shadowRoot?.querySelector('p')?.textContent).toContain(
      descriptionMoreText
    );
    button?.click();
    expect(element?.shadowRoot?.querySelector('p')?.textContent).toContain(
      descriptionLessText
    );
  });

  it('should change button text depends on toggled state', async () => {
    element = await fixture(
      html` <product-description
        sku="1"
        .content="${{ truncateCharacterCount: 100 }}"
      ></product-description>`
    );
    const button = element?.shadowRoot?.querySelector('button');
    expect(button?.textContent).toContain('Read more');
    button?.click();
    expect(button?.textContent).toContain('Read less');
  });

  it('should check number of paragraph and br tags, depending on the text', async () => {
    element = await fixture(
      html` <product-description
        sku="1"
        .content="${{ truncateCharacterCount: 100 }}"
      ></product-description>`
    );
    element.toggle();
    expect(element.shadowRoot?.querySelectorAll('p').length).toBe(2);
    expect(element.shadowRoot?.querySelectorAll('br').length).toBe(1);
  });
});
