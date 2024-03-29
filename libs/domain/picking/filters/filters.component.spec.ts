import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { FormRenderer } from '@spryker-oryx/form';
import {
  PickingListService,
  defaultQualifier,
} from '@spryker-oryx/picking/services';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { PickingFiltersComponent } from './filters.component';
import { pickingFiltersComponent } from './filters.def';
import { getFilterFields } from './filters.model';

class MockPickingListService implements Partial<PickingListService> {
  getQualifier = vi.fn().mockReturnValue(of(defaultQualifier));
  setQualifier = vi.fn();
}

class MockFormRenderer implements Partial<FormRenderer> {
  buildForm = vi.fn().mockReturnValue(html``);
}

describe('PickingFiltersComponent', () => {
  let element: PickingFiltersComponent;
  let service: MockPickingListService;
  let renderer: MockFormRenderer;

  beforeAll(async () => {
    await useComponent(pickingFiltersComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: FormRenderer,
          useClass: MockFormRenderer,
        },
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
      ],
    });
    renderer = testInjector.inject(FormRenderer) as unknown as MockFormRenderer;
    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;
    element = await fixture(
      html`<oryx-picking-filters></oryx-picking-filters>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should build the form', () => {
    expect(renderer.buildForm).toHaveBeenCalledWith(getFilterFields(), {
      sortBy: 'deliveryDate.asc',
    });
  });

  describe('when qualifier changes', () => {
    beforeEach(async () => {
      service.getQualifier = vi.fn().mockReturnValue(
        of({
          ...defaultQualifier,
          sortDesc: false,
        })
      );
      element = await fixture(
        html`<oryx-picking-filters open></oryx-picking-filters>`
      );
    });

    it('should format the correct value', () => {
      expect(renderer.buildForm).toHaveBeenCalledWith(getFilterFields(), {
        sortBy: 'deliveryDate.asc',
      });
    });
  });

  describe('when filters are opened', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-picking-filters open></oryx-picking-filters>`
      );
    });

    it('should open the modal', () => {
      expect(element).toContainElement('oryx-modal[open]');
    });

    describe('and modal is closed', () => {
      let reset: SpyInstance;

      beforeEach(() => {
        const form = element.renderRoot.querySelector<HTMLFormElement>('form')!;
        reset = vi.spyOn(form, 'reset');
        element.renderRoot
          .querySelector('oryx-modal')
          ?.dispatchEvent(new CustomEvent('oryx.close'));
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });

      it('should reset the form', () => {
        expect(reset).toHaveBeenCalled();
      });
    });

    describe('and modal is reset', () => {
      let reset: SpyInstance;

      beforeEach(() => {
        const form = element.renderRoot.querySelector<HTMLFormElement>('form')!;
        reset = vi.spyOn(form, 'reset');
        element.renderRoot
          .querySelector('oryx-modal')
          ?.dispatchEvent(new CustomEvent('oryx.back'));
      });

      it('should set default qualifiers', () => {
        expect(service.setQualifier).toHaveBeenCalledWith(defaultQualifier);
      });

      it('should close the modal', () => {
        expect(element).not.toContainElement('oryx-modal[open]');
      });

      it('should reset the form', () => {
        expect(reset).toHaveBeenCalled();
      });
    });

    describe('and filters are applied', () => {
      let request: SpyInstance;
      const sortBy = 'sortBy';
      const sortDesc = 'desc';

      beforeEach(async () => {
        renderer.buildForm = vi.fn().mockReturnValue(html`
          <input name="sortBy" value=${`${sortBy}.${sortDesc}`} checked />
        `);
        element = await fixture(
          html`<oryx-picking-filters open></oryx-picking-filters>`
        );
        const form = element.renderRoot.querySelector<HTMLFormElement>('form')!;
        request = vi.spyOn(form, 'requestSubmit');
        element.renderRoot
          .querySelector<HTMLElement>('oryx-button[slot="footer"]')
          ?.click();
      });

      it('should request submit of the form', () => {
        expect(request).toHaveBeenCalled();
      });

      it('should update the qualifier', () => {
        expect(service.setQualifier).toHaveBeenCalledWith({
          sortBy,
          sortDesc: true,
        });
      });
    });

    describe('when Enter key is pressed in the form', () => {
      let event: KeyboardEvent;
      let request: SpyInstance;
      const sortBy = 'sortBy';
      const sortDesc = 'desc';

      beforeEach(async () => {
        renderer.buildForm = vi.fn().mockReturnValue(html`
          <input name="sortBy" value=${`${sortBy}.${sortDesc}`} checked />
        `);
        element = await fixture(
          html` <oryx-picking-filters open></oryx-picking-filters>`
        );

        const form = element.renderRoot.querySelector<HTMLFormElement>('form')!;
        request = vi.spyOn(form, 'requestSubmit');

        event = new KeyboardEvent('keydown', { key: 'Enter' });
        event.preventDefault = vi.fn();

        form.dispatchEvent(event);
      });

      it('should prevent default form submission', () => {
        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('should request submit of the form', () => {
        expect(request).toHaveBeenCalled();
      });

      it('should update the qualifier', () => {
        expect(service.setQualifier).toHaveBeenCalledWith({
          sortBy,
          sortDesc: true,
        });
      });
    });
  });
});
