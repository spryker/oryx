import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { ExperienceService } from '@spryker-oryx/experience';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import '@spryker-oryx/testing';
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
      element = await fixture(html`<product-labels sku="3"></product-labels>`);
    });

    it('should not render chip elements', () => {
      expect(element).not.toContainElement('oryx-chip');
    });
  });

  describe('when the product has labels', () => {
    beforeEach(async () => {
      element = await fixture(html`<product-labels sku="1"></product-labels>`);
    });

    it('should render 2 chip elements', () => {
      const chips = element.renderRoot.querySelectorAll('oryx-chip');
      expect(chips.length).toBe(2);
    });

    describe('and NEW labels are excluded', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-labels
            sku="1"
            .options=${{ excluded: 'new' }}
          ></product-labels>`
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
          html`<product-labels
            sku="1"
            .options=${{ included: 'SALE' }}
          ></product-labels>`
        );
      });

      it('should only render the SALE label', () => {
        const chips = element.renderRoot.querySelectorAll('oryx-chip');
        expect(chips.length).toBe(1);
        expect(chips[0].textContent?.trim()).toBe('sale');
      });
    });
  });
});
