import '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { mockProductProviders } from '../../src/mocks';
import { ProductLabelsComponent } from './label.component';
import { productLabelsComponent } from './label.def';

class MockExperienceContentService implements Partial<ExperienceService> {
  getOptions = ({ uid = '' }): Observable<any> => of({});
}

describe('ProductLabelsComponent', () => {
  let element: ProductLabelsComponent;

  beforeAll(async () => {
    await useComponent(productLabelsComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        ...mockProductProviders,
        {
          provide: ExperienceService,
          useClass: MockExperienceContentService,
        },
      ],
    });
  });

  afterEach(() => {
    destroyInjector();
  });

  describe('when the product has no labels', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-labels sku="3"></oryx-product-labels>`
      );
    });

    it('should not render chip elements', () => {
      expect(element).not.toContainElement('oryx-chip');
    });
  });

  describe('when the product has labels', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-labels sku="1"></oryx-product-labels>`
      );
    });

    it('should render 2 chip elements', () => {
      const chips = element.renderRoot.querySelectorAll('oryx-chip');
      expect(chips.length).toBe(2);
    });

    describe('and NEW labels are excluded', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-labels
            sku="1"
            .options=${{ excluded: 'new' }}
          ></oryx-product-labels>`
        );
      });

      it('should only render the SALE label', () => {
        const chips = element.renderRoot.querySelectorAll('oryx-chip');
        expect(chips.length).toBe(1);
        expect(chips[0].textContent?.trim()).toBe('sale');
      });
    });

    describe('and SALE labels are included', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-product-labels
            sku="1"
            .options=${{ included: 'SALE' }}
          ></oryx-product-labels>`
        );
      });

      it('should only render the SALE label', () => {
        const chips = element.renderRoot.querySelectorAll('oryx-chip');
        expect(chips.length).toBe(1);
        expect(chips[0].textContent?.trim()).toBe('sale');
      });
    });
  });

  describe('when the product label is inverted', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-labels
          sku="1"
          .options=${{ invert: true }}
        ></oryx-product-labels>`
      );
    });

    it('should render inverted chip elements', () => {
      expect(element).toContainElement('oryx-chip[invert]');
    });
  });

  describe('when the product label is not inverted', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-labels
          sku="1"
          .options=${{ invert: false }}
        ></oryx-product-labels>`
      );
    });

    it('should not render inverted chip elements', () => {
      expect(element).toContainElement('oryx-chip:not([invert])');
    });
  });

  describe('when invert is not provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-product-labels sku="1"></oryx-product-labels>`
      );
    });

    it('should not render inverted chip elements', () => {
      expect(element).toContainElement('oryx-chip:not([invert])');
    });
  });
});
