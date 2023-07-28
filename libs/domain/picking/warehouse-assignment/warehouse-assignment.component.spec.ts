import { fixture } from '@open-wc/testing-helpers';
import { App, AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  WarehouseUserAssignmentsService,
  warehouseAssignmentComponent,
} from '@spryker-oryx/picking';
import { mockWarehouseUserAssignments } from '@spryker-oryx/picking/mocks';
import { RouterService } from '@spryker-oryx/router';
import { ButtonComponent } from '@spryker-oryx/ui/button';
import { i18n, nextTick, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of, switchMap } from 'rxjs';
import { beforeEach, vi } from 'vitest';
import { WarehouseAssignmentComponent } from './warehouse-assignment.component';

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
  getList = vi.fn().mockReturnValue(of(mockWarehouseUserAssignments));
  activateAssignment = vi
    .fn()
    .mockReturnValue(of(mockWarehouseUserAssignments[0]));
}

class MockRouterService implements Partial<RouterService> {
  navigate = vi.fn();
}

describe('WarehouseAssignmentComponent', () => {
  let el: WarehouseAssignmentComponent;

  let service: WarehouseUserAssignmentsService;
  let routerService: RouterService;

  beforeAll(async () => {
    await useComponent(warehouseAssignmentComponent);
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

    service = testInjector.inject(WarehouseUserAssignmentsService);
    routerService = testInjector.inject(RouterService);

    el = await fixture(
      html`<oryx-warehouse-assignment></oryx-warehouse-assignment>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
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
    expect(el).toContainElement('oryx-header');
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
