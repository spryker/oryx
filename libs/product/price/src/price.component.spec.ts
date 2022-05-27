import { fixture, fixtureCleanup } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
import { html } from 'lit';
import { MOCK_PRODUCT_PROVIDERS } from '../../src/mocks';
import '../index';
import { PriceComponent } from './price.component';

const renderElement = async (code: number) =>
  await fixture<PriceComponent>(
    html`<product-price code="${code}"></product-price>`
  );

describe('Price', () => {
  let element: PriceComponent;
  const getPriceElements = () => element.shadowRoot?.querySelectorAll('.price');

  beforeEach(async () => {
    createInjector({
      providers: MOCK_PRODUCT_PROVIDERS,
    });
  });

  afterEach(() => {
    destroyInjector();
    fixtureCleanup();
  });

  it('is defined', async () => {
    element = await renderElement(1);
    expect(element).toBeInstanceOf(PriceComponent);
  });

  it('passes the a11y audit', async () => {
    element = await renderElement(5);

    await expect(element).shadowDom.to.be.accessible();
  });

  describe('should render product price', async () => {
    it('only gross', async () => {
      element = await renderElement(1);
      const priceElements = getPriceElements();

      expect(priceElements).toHaveLength(1);
      expect(priceElements?.[0].classList.contains('grossAmount')).toBe(true);
    });

    it('only net', async () => {
      element = await renderElement(5);
      const priceElements = getPriceElements();

      expect(priceElements).toHaveLength(1);
      expect(priceElements?.[0].classList.contains('netAmount')).toBe(true);
    });

    it('net and gross', async () => {
      element = await renderElement(4);
      const priceElements = getPriceElements();

      expect(priceElements).toHaveLength(2);
      expect(priceElements?.[0].classList.contains('grossAmount')).toBe(true);
      expect(priceElements?.[1].classList.contains('netAmount')).toBe(true);
    });

    it('not render if no prices', async () => {
      element = await renderElement(3);
      const priceElements = getPriceElements();

      expect(priceElements).toHaveLength(0);
    });

    it('not render if incorrect currency', async () => {
      element = await renderElement(6);
      const priceElements = getPriceElements();

      expect(priceElements).toHaveLength(0);
    });
  });
});
