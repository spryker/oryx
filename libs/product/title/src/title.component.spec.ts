import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { TitleComponent } from './title.component';

describe('Title', () => {
  let element: TitleComponent;

  beforeEach(async () => {
    createInjector({
      providers: MOCK_PRODUCT_PROVIDERS,
    });
    element = await fixture(
      html`<product-title
        sku="1"
        uid="1"
        .content=${{ tag: 'h1' }}
      ></product-title>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  const expectContentInTag = (tag: string) => {
    describe(`<${tag}> tag`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-title sku="1" .content=${{ tag }}></product-title>`
        );
      });
      it(`should render the product title in the tag`, () => {
        const textContent = 'Sample product';
        const heading = element?.shadowRoot?.querySelector(tag);
        expect(heading?.textContent?.trim()).to.be.equal(textContent);
      });
    });
  };

  describe('tags', () => {
    expectContentInTag('h1');
    expectContentInTag('h2');
    expectContentInTag('h3');
    expectContentInTag('h4');
    expectContentInTag('h5');
    expectContentInTag('h6');

    describe('it should not render a tag', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-title sku="1" uid="1" .content=${{}}></product-title>`
        );
      });
      it(`should not render a tag`, () => {
        expect(
          element?.shadowRoot?.querySelectorAll('*:not(style)').length
        ).to.eq(0);
      });

      it('should render product title as plain text', () => {
        const textContent = 'Sample product';
        expect(
          element?.shadowRoot?.textContent?.trim().includes(textContent)
        ).toBeTruthy();
      });
    });
  });
});
