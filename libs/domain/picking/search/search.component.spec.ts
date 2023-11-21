import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { PickingListService } from '../services';
import { PickingSearchComponent } from './search.component';
import { pickingSearchComponent } from './search.def';

class MockPickingListService implements Partial<PickingListService> {
  setQualifier = vi.fn();
  toggleActiveSearch = vi.fn();
}

describe('PickingSearchComponent', () => {
  let element: PickingSearchComponent;
  let service: MockPickingListService;

  beforeAll(async () => {
    await useComponent(pickingSearchComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: PickingListService,
          useClass: MockPickingListService,
        },
      ],
    });

    service = testInjector.inject<MockPickingListService>(PickingListService);

    element = await fixture(html`<oryx-picking-search></oryx-picking-search>`);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should render the search', () => {
    expect(element).toContainElement(
      `oryx-search[float][backIcon="${IconTypes.Backward}"]`
    );
  });

  it('should render the input', () => {
    expect(element).toContainElement(
      `input[placeholder="${i18n('picking.header.order-ID')}"]`
    );
  });

  describe('when search is opened', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('oryx-search')
        ?.dispatchEvent(new CustomEvent('oryx.open'));
    });

    it('should set empty search qualifier', () => {
      expect(service.setQualifier).toHaveBeenCalledWith(
        expect.objectContaining({
          searchOrderReference: '',
        })
      );
    });

    it('should turn on active search', () => {
      expect(service.toggleActiveSearch).toHaveBeenCalledWith(true);
    });

    describe('and typing is started', () => {
      const searchOrderReference = 'test';
      beforeEach(() => {
        const input = element.renderRoot.querySelector(
          'input'
        ) as HTMLInputElement;
        input.value = searchOrderReference;
        input.dispatchEvent(new InputEvent('input'));
      });

      it('should set search qualifier', () => {
        expect(service.setQualifier).toHaveBeenCalledWith(
          expect.objectContaining({
            searchOrderReference,
          })
        );
      });

      describe('and test is to short', () => {
        const searchOrderReference = 't';
        beforeEach(() => {
          const input = element.renderRoot.querySelector(
            'input'
          ) as HTMLInputElement;
          input.value = searchOrderReference;
          input.dispatchEvent(new InputEvent('input'));
        });

        it('should not set search qualifier', () => {
          expect(service.setQualifier).not.toHaveBeenCalledWith();
        });
      });
    });
  });

  describe('when search is closed', () => {
    beforeEach(() => {
      element.renderRoot
        .querySelector('oryx-search')
        ?.dispatchEvent(new CustomEvent('oryx.close'));
    });

    it('should set empty search qualifier', () => {
      expect(service.setQualifier).toHaveBeenCalledWith(
        expect.objectContaining({
          searchOrderReference: '',
        })
      );
    });

    it('should turn off active search', () => {
      expect(service.toggleActiveSearch).toHaveBeenCalledWith(false);
    });
  });
});
