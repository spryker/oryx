import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  WarehouseUserAssignmentsService,
  warehouseAssignmentComponent,
} from '@spryker-oryx/picking';
import { mockWarehouseUserAssignments } from '@spryker-oryx/picking/mocks';
import { RouterService } from '@spryker-oryx/router';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach, vi } from 'vitest';
import { WarehouseAssignmentComponent } from './warehouse-assignment.component';

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

  it('should render button of each location', () => {
    const buttons = el.renderRoot.querySelectorAll('button');
    expect(buttons.length).toBe(mockWarehouseUserAssignments.length);
    mockWarehouseUserAssignments.forEach((item, index) => {
      expect(buttons[index].textContent).toContain(i18n('picking.select'));
    });
  });

  it('should not call "activateAssignment" and "navigate" methods initially', () => {
    expect(service.activateAssignment).not.toHaveBeenCalled();
    expect(routerService.navigate).not.toHaveBeenCalled();
  });

  describe('when "Select" button is clicked', () => {
    beforeEach(() => {
      const button = el.renderRoot.querySelector('button');
      button?.click();
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
