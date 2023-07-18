import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { LinkService } from '@spryker-oryx/site';
import { LinkType } from '@spryker-oryx/ui/link';
import { html } from 'lit';
import { of } from 'rxjs';
import { ProductTitleComponent } from './title.component';
import { productTitleComponent } from './title.def';

class MockSemanticLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/product/123'));
}

describe('ProductTitleComponent', () => {
  let element: ProductTitleComponent;

  beforeAll(async () => {
    await useComponent(productTitleComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: LinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });
    element = await fixture(
      html`<oryx-product-title
        sku="1"
        .options=${{ tag: 'h1' }}
      ></oryx-product-title>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe('when the linkType is undefined', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-title sku="1"></oryx-product-title>`
      );
    });

    it('should render a heading', () => {
      expect(element).toContainElement('oryx-heading');
    });

    it('should not render a link', () => {
      expect(element).not.toContainElement('oryx-content-link');
    });
  });

  describe(`when a the link option is 'none'`, () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-title
          sku="1"
          .options=${{ linkType: 'none' }}
        ></oryx-product-title>`
      );
    });

    it('should render a heading', () => {
      expect(element).toContainElement('oryx-heading');
    });

    it('should not render a link', () => {
      expect(element).not.toContainElement('oryx-content-link');
    });
  });

  describe('when the linkType is Link', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-title
          sku="1"
          .options=${{ linkType: LinkType.Link }}
        ></oryx-product-title>`
      );
    });

    it('should render a heading with a link', () => {
      expect(element).toContainElement('oryx-heading oryx-link');
    });
  });

  describe('when the linkType is ExternalLink', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-title
          sku="1"
          .options=${{ linkType: LinkType.ExternalLink }}
        ></oryx-product-title>`
      );
    });

    it('should render a heading with a link', () => {
      expect(element).toContainElement('oryx-heading oryx-link');
    });
  });
});
