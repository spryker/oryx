import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  GetWarehouseUserAssignmentsResponse,
  PickingHttpService,
  WarehouseUserAssignmentsAdapter,
  WarehouseUserAssignmentsDefaultAdapter,
} from '@spryker-oryx/picking';
import { nextTick } from '@spryker-oryx/utilities';
import { of } from 'rxjs';

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

describe('WarehouseUserAssignmentsDefaultAdapter', () => {
  let adapter: WarehouseUserAssignmentsAdapter;
  let http: PickingHttpService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
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
    const callback = vi.fn();

    beforeEach(() => {
      adapter.getList().subscribe(callback);
    });

    it('should call the "get" method of PickingHttpService', async () => {
      expect(http.get).toHaveBeenCalled();
      await nextTick(1);
      expect(callback).toHaveBeenCalledWith([
        {
          id: mockResponseWarehouseUserAssignment.id,
          userUuid: mockResponseWarehouseUserAssignment.attributes.userUuid,
          isActive: mockResponseWarehouseUserAssignment.attributes.isActive,
          warehouse: mockResponseWarehouseUserAssignment.attributes.warehouse,
        },
      ]);
    });
  });

  describe('when "activateAssignment" method is called', () => {
    const callback = vi.fn();

    beforeEach(() => {
      adapter
        .activateAssignment(mockResponseWarehouseUserAssignment.id)
        .subscribe(callback);
    });

    it('should call the "patch" method of PickingHttpService', async () => {
      expect(http.patch).toHaveBeenCalledWith(
        `/warehouse-user-assignments/${mockResponseWarehouseUserAssignment.id}`,
        {
          isActive: true,
        }
      );
      await nextTick(1);
      expect(callback).toHaveBeenCalledWith({
        id: mockResponseWarehouseUserAssignment.id,
        userUuid: mockResponseWarehouseUserAssignment.attributes.userUuid,
        isActive: mockResponseWarehouseUserAssignment.attributes.isActive,
        warehouse: mockResponseWarehouseUserAssignment.attributes.warehouse,
      });
    });
  });
});
