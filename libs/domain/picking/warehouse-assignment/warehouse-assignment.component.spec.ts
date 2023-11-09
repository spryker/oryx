import { fixture } from '@open-wc/testing-helpers';
import { App, AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  WarehouseUserAssignmentsService,
  pickingWarehouseAssignmentComponent,
} from '@spryker-oryx/picking/api';
import { mockWarehouseUserAssignments } from '@spryker-oryx/picking/mocks';
import { RouterService } from '@spryker-oryx/router';
import { ButtonComponent } from '@spryker-oryx/ui/button';
import { i18n, nextTick, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of, switchMap } from 'rxjs';
import { beforeEach, vi } from 'vitest';
import { PickingWarehouseAssignmentComponent } from './warehouse-assignment.component';

const mockOfflineDataPlugin = {
  refreshData: vi.fn().mockReturnValue(
    of(undefined).pipe(
      switchMap(async () => {
        await nextTick(2);
        return of(undefined);
      })
    )
  ),
};

class MockApp implements Partial<App> {
  requirePlugin = vi.fn().mockReturnValue(mockOfflineDataPlugin);
}

class MockWarehouseUserAssignmentsService
  implements Partial<WarehouseUserAssignmentsService>
{
  getList = vi.fn();
  activateAssignment = vi
    .fn()
    .mockReturnValue(of(mockWarehouseUserAssignments[0]));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('PickingWarehouseAssignmentComponent', () => {
  let el: PickingWarehouseAssignmentComponent;

  let service: MockWarehouseUserAssignmentsService;
  let routerService: RouterService;

  beforeAll(async () => {
    await useComponent(pickingWarehouseAssignmentComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: AppRef,
          useClass: MockApp,
        },
        {
          provide: WarehouseUserAssignmentsService,
          useClass: MockWarehouseUserAssignmentsService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    service = testInjector.inject<MockWarehouseUserAssignmentsService>(
      WarehouseUserAssignmentsService
    );
    routerService = testInjector.inject(RouterService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when there is multiple warehouses', () => {
    beforeEach(async () => {
      service.getList.mockReturnValue(of(mockWarehouseUserAssignments));
      el = await fixture(
        html`<oryx-picking-warehouse-assignment></oryx-picking-warehouse-assignment>`
      );
    });

    it('should render name of each location', () => {
      const headings = el.renderRoot.querySelectorAll('h3');
      expect(headings.length).toBe(mockWarehouseUserAssignments.length);
      mockWarehouseUserAssignments.forEach((item, index) => {
        expect(headings[index].textContent).toBe(
          mockWarehouseUserAssignments[index].warehouse.name
        );
      });
    });

    it('should render header', () => {
      expect(el).toContainElement('oryx-picking-header');
    });

    mockWarehouseUserAssignments.forEach((item, index) => {
      it(`should render button (${index}) of each location`, () => {
        const buttons =
          el.renderRoot.querySelectorAll<ButtonComponent>('oryx-button');
        expect(buttons.length).toBe(mockWarehouseUserAssignments.length);
        expect(buttons[index]).toHaveProperty('text', i18n('picking.select'));
      });
    });

    it('should not call "activateAssignment" and "navigate" methods initially', () => {
      expect(service.activateAssignment).not.toHaveBeenCalled();
      expect(routerService.navigate).not.toHaveBeenCalled();
    });

    describe('when "Select" button is clicked', () => {
      beforeEach(() => {
        el.renderRoot.querySelector<HTMLElement>('oryx-button')?.click();
      });

      it('should call "activateAssignment" method', () => {
        expect(service.activateAssignment).toHaveBeenCalledWith(
          mockWarehouseUserAssignments[0].id
        );
      });

      it('should navigate to "/" route', () => {
        expect(routerService.navigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('when there is only one warehouse to choose', () => {
    beforeEach(async () => {
      service.getList.mockReturnValue(
        of(mockWarehouseUserAssignments.slice(0, 1))
      );
      el = await fixture(
        html`<oryx-picking-warehouse-assignment></oryx-picking-warehouse-assignment>`
      );
    });

    it('should call "activateAssignment" and not render any location ', () => {
      const headings = el.renderRoot.querySelectorAll('h3');
      expect(headings.length).toBe(0);

      expect(service.activateAssignment).toHaveBeenCalledWith(
        mockWarehouseUserAssignments[0].id
      );
    });

    it('should navigate to "/" route', () => {
      expect(routerService.navigate).toHaveBeenCalledWith('/');
    });
  });

  describe('when the list is empty', () => {
    beforeEach(async () => {
      service.getList.mockReturnValue(
        of(mockWarehouseUserAssignments.slice(0, 0))
      );
      el = await fixture(
        html`<oryx-picking-warehouse-assignment></oryx-picking-warehouse-assignment>`
      );
    });

    it('should render fallback', () => {
      expect(el).toContainElement('oryx-image');

      const image = el.renderRoot.querySelector('oryx-image');
      expect(image?.hasAttribute('resource')).toBe(true);
    });
  });
});
