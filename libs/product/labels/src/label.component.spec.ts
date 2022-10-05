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

const mockSku = '1';

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

  describe('when the product has 1 label', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<product-labels sku="${mockSku}" .options=${{}}></product-labels>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render 1 chip element', () => {
      const chips = element.renderRoot.querySelectorAll('oryx-chip');
      expect(chips.length).toBe(1);
    });
  });

  describe('when the product has 2 labels', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<product-labels sku="2" .options=${{}}></product-labels>`
      );
    });

    it('should render 2 chip element', () => {
      const chips = element.renderRoot.querySelectorAll('oryx-chip');
      expect(chips.length).toBe(2);
    });

    describe('but when NEW labels are excluded', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-labels
            sku="2"
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

    describe('but when SALE labels are included', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<product-labels
            sku="2"
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
