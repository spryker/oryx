import { JsonAPITransformerService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { GetWarehouseUserAssignmentsResponse } from '../../models';
import { PickingHttpService } from '../picking-http.service';
import { WarehouseUserAssignmentsDefaultAdapter } from './warehouse-user-assignments-default.adapter';
import { WarehouseUserAssignmentsAdapter } from './warehouse-user-assignments.adapter';

const mockResponseWarehouseUserAssignment = {
  type: 'warehouse-user-assignments',
  id: 'id1',
  attributes: {
    userUuid: 'userUuid1',
    warehouse: {
      uuid: 'warehouseUuid1',
      name: 'Warehouse 1',
      isActive: true,
    },
    isActive: true,
  },
};

class MockPickingHttpService implements Partial<PickingHttpService> {
  get = vi.fn().mockReturnValue(
    of<GetWarehouseUserAssignmentsResponse>({
      data: [mockResponseWarehouseUserAssignment],
      links: {
        self: '',
      },
    })
  );
  patch = vi.fn().mockReturnValue(
    of({
      data: mockResponseWarehouseUserAssignment,
    })
  );
}

const mockTransformerData = 'mockTransformerData';

const mockTransformer = {
  do: vi.fn().mockReturnValue(() => of(mockTransformerData)),
};

describe('WarehouseUserAssignmentsDefaultAdapter', () => {
  const endpoint = '/warehouse-user-assignments';
  const callback = vi.fn();
  let adapter: WarehouseUserAssignmentsAdapter;
  let http: PickingHttpService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: JsonAPITransformerService,
          useValue: mockTransformer,
        },
        {
          provide: WarehouseUserAssignmentsAdapter,
          useClass: WarehouseUserAssignmentsDefaultAdapter,
        },
        {
          provide: PickingHttpService,
          useClass: MockPickingHttpService,
        },
      ],
    });

    adapter = testInjector.inject(WarehouseUserAssignmentsAdapter);
    http = testInjector.inject(PickingHttpService);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(WarehouseUserAssignmentsDefaultAdapter);
  });

  describe('when "getList" method is called', () => {
    beforeEach(() => {
      adapter.getList().subscribe(callback);
    });

    it('should call the "get" method of PickingHttpService with endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(endpoint);
    });

    it('should return transformed data', () => {
      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });

  describe('when "activateAssignment" method is called', () => {
    beforeEach(() => {
      adapter
        .activateAssignment(mockResponseWarehouseUserAssignment.id)
        .subscribe(callback);
    });

    it('should call the "patch" method of PickingHttpService', () => {
      expect(http.patch).toHaveBeenCalledWith(
        `${endpoint}/${mockResponseWarehouseUserAssignment.id}`,
        {
          data: {
            attributes: {
              isActive: true,
            },
          },
        }
      );
    });

    it('should receive updated warehouse user assignment', () => {
      expect(callback).toHaveBeenCalledWith(mockTransformerData);
    });
  });
});
