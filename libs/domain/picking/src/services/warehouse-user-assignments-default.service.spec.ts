import {
  createInjector,
  destroyInjector,
  Injector,
  Provider,
} from '@spryker-oryx/di';
import {
  WarehouseUserAssignmentsAdapter,
  WarehouseUserAssignmentsDefaultService,
  WarehouseUserAssignmentsService,
} from '@spryker-oryx/picking';
import { of } from 'rxjs';
import { beforeEach, describe } from 'vitest';
import {
  WarehouseUserAssignment,
  warehouseUserAssignmentStorageKey,
} from '../models/warehouse-user-assignment';
import { StorageService } from '@spryker-oryx/core';
import { AuthService, OauthService } from '@spryker-oryx/auth';

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

class MockStorageService implements Partial<StorageService> {
  get = vi.fn().mockReturnValue(of(undefined));
  set = vi.fn().mockReturnValue(of(undefined));
  remove = vi.fn().mockReturnValue(of(undefined));
}

describe('WarehouseUserAssignmentsDefaultService', () => {
  const callback = vi.fn();
  const commonProviders: Provider[] = [
    {
      provide: WarehouseUserAssignmentsService,
      useClass: WarehouseUserAssignmentsDefaultService,
    },
    {
      provide: WarehouseUserAssignmentsAdapter,
      useClass: MockWarehouseUserAssignmentsAdapter,
    },
    {
      provide: StorageService,
      useClass: MockStorageService,
    },
  ];

  let service: WarehouseUserAssignmentsService;
  let adapter: MockWarehouseUserAssignmentsAdapter;
  let storageService: MockStorageService;
  let testInjector: Injector;

  const injectMocks = (providers: Provider[]) => {
    testInjector = createInjector({
      providers,
    });

    service = testInjector.inject(WarehouseUserAssignmentsService);
    adapter = testInjector.inject(
      WarehouseUserAssignmentsAdapter
    ) as MockWarehouseUserAssignmentsAdapter;
    storageService = testInjector.inject<MockStorageService>(StorageService);
  };

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  describe('when user is not authenticated', () => {
    class MockAuthService implements Partial<AuthService> {
      isAuthenticated = vi.fn().mockReturnValue(of(false));
    }

    beforeEach(() => {
      injectMocks([
        ...commonProviders,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ]);
    });

    it('should remove warehouse assignment from storage', () => {
      expect(storageService.remove).toHaveBeenCalled();
    });
  });

  describe('when user is authenticated', () => {
    class MockAuthService implements Partial<AuthService> {
      isAuthenticated = vi.fn().mockReturnValue(of(true));
    }

    beforeEach(() => {
      injectMocks([
        ...commonProviders,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ]);
    });

    it('should not remove warehouse assignment from storage', () => {
      expect(storageService.remove).not.toHaveBeenCalledWith(
        warehouseUserAssignmentStorageKey
      );
    });

    describe('when "getList" method is called', () => {
      beforeEach(() => {
        service.getList().subscribe(callback);
      });

      it('should call the "getList" method of the adapter', () => {
        expect(adapter.getList).toHaveBeenCalled();
      });

      it('should get the list of warehouse user assignments', () => {
        expect(callback).toHaveBeenCalledWith([mockWarehouseUserAssignment]);
      });
    });

    describe('when "getUserAssignment" method is called', () => {
      beforeEach(() => {
        service.getUserAssignment().subscribe(callback);
      });

      it('should call the "get" method of the storage service', () => {
        expect(storageService.get).toHaveBeenCalledWith(
          warehouseUserAssignmentStorageKey
        );
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
      });

      it('should get updated warehouse user assignment', () => {
        expect(callback).toHaveBeenCalledWith(mockWarehouseUserAssignment);
      });

      it('should set assignment in storage', () => {
        expect(storageService.set).toHaveBeenCalledWith(
          warehouseUserAssignmentStorageKey,
          mockWarehouseUserAssignment
        );
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
          new Error(
            'WarehouseUserAssignmentsService: Warehouse is not assigned!'
          )
        );
      });
    });
  });
});
