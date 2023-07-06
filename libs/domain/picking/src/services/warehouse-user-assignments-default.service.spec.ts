import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  WarehouseUserAssignmentsAdapter,
  WarehouseUserAssignmentsDefaultService,
  WarehouseUserAssignmentsService,
} from '@spryker-oryx/picking';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { WarehouseUserAssignment } from '../models/warehouse';

const mockWarehouseUserAssignment: WarehouseUserAssignment = {
  id: 'id1',
  userUuid: 'userUuid1',
  warehouse: {
    uuid: 'warehouseUuid1',
    name: 'Warehouse 1',
    isActive: true,
  },
  isActive: true,
};

class MockWarehouseUserAssignmentsAdapter
  implements Partial<WarehouseUserAssignmentsAdapter>
{
  getList = vi.fn().mockReturnValue(of([mockWarehouseUserAssignment]));
  activateAssignment = vi.fn().mockReturnValue(of(mockWarehouseUserAssignment));
}

describe('WarehouseUserAssignmentsDefaultService', () => {
  const callback = vi.fn();

  let service: WarehouseUserAssignmentsService;
  let adapter: MockWarehouseUserAssignmentsAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: WarehouseUserAssignmentsService,
          useClass: WarehouseUserAssignmentsDefaultService,
        },
        {
          provide: WarehouseUserAssignmentsAdapter,
          useClass: MockWarehouseUserAssignmentsAdapter,
        },
      ],
    });

    service = testInjector.inject(WarehouseUserAssignmentsService);
    adapter = testInjector.inject(
      WarehouseUserAssignmentsAdapter
    ) as MockWarehouseUserAssignmentsAdapter;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when "getList" method is called', () => {
    beforeEach(() => {
      service.getList().subscribe(callback);
    });

    it('should call the "getList" method of the adapter', () => {
      expect(adapter.getList).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith([mockWarehouseUserAssignment]);
    });
  });

  describe('when "activateAssignment" method is called', () => {
    beforeEach(() => {
      service
        .activateAssignment(mockWarehouseUserAssignment.id)
        .subscribe(callback);
    });

    it('should call the "activateAssignment" method of the adapter', () => {
      expect(adapter.activateAssignment).toHaveBeenCalledWith(
        mockWarehouseUserAssignment.id
      );
      expect(callback).toHaveBeenCalledWith(mockWarehouseUserAssignment);
    });
  });

  describe('when "activateAssignment" method is called with incorrect data', () => {
    beforeEach(() => {
      adapter.activateAssignment.mockReturnValue(
        of({
          ...mockWarehouseUserAssignment,
          isActive: false,
        })
      );

      service
        .activateAssignment(mockWarehouseUserAssignment.id)
        .subscribe({ error: callback });
    });

    it('should throw error if warehouse is not assigned', () => {
      expect(callback).toHaveBeenCalledWith(
        new Error('WarehouseUserAssignmentsService: Warehouse is not assigned!')
      );
    });
  });
});
