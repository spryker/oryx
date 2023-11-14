import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  PickingListService,
  defaultSortingQualifier,
} from '@spryker-oryx/picking/services';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { PickingFilterButtonComponent } from './filter-button.component';
import { pickingFilterButtonComponent } from './filter-button.def';

class MockPickingListService implements Partial<PickingListService> {
  getSortingQualifier = vi.fn().mockReturnValue(of(defaultSortingQualifier));
}

describe('PickingFilterButtonComponent', () => {
  let element: PickingFilterButtonComponent;
  let service: MockPickingListService;

  beforeAll(async () => {
    await useComponent(pickingFilterButtonComponent);
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
    service = testInjector.inject(
      PickingListService
    ) as unknown as MockPickingListService;
    element = await fixture(
      html`<oryx-picking-filter-button></oryx-picking-filter-button>`
    );
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should not check the input', () => {
    expect(element).not.toContainElement('input:checked, input[checked]');
  });

  describe('when selected sort by method is not default', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
      service.getSortingQualifier = vi.fn().mockReturnValue(
        of({
          ...defaultSortingQualifier,
          sortBy: 'test',
        })
      );
      element = await fixture(
        html`<oryx-picking-filter-button></oryx-picking-filter-button>`
      );
      vi.advanceTimersByTime(1);
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should check the input', () => {
      expect(element).toContainElement('input[checked]:checked');
    });
  });

  describe('when selected sorting order is not default', () => {
    beforeEach(async () => {
      service.getSortingQualifier = vi.fn().mockReturnValue(
        of({
          ...defaultSortingQualifier,
          sortDesc: true,
        })
      );
      element = await fixture(
        html`<oryx-picking-filter-button></oryx-picking-filter-button>`
      );
    });

    it('should check the input', () => {
      expect(element).toContainElement('input[checked]:checked');
    });
  });

  describe('when input clicked', () => {
    let prevented: SpyInstance;

    beforeEach(async () => {
      element = await fixture(
        html`<oryx-picking-filter-button></oryx-picking-filter-button>`
      );

      const event = new MouseEvent('click');
      prevented = vi.spyOn(event, 'preventDefault');
      element.renderRoot.querySelector('input')?.dispatchEvent(event);
    });

    it('should be prevented', () => {
      expect(prevented).toHaveBeenCalledOnce();
    });

    it('should open the filters', () => {
      expect(element).toContainElement('oryx-picking-filters[open]');
    });
  });
});
