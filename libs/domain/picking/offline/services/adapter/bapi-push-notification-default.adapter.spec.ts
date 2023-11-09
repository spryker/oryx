import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  PickingHttpService,
  WarehouseUserAssignmentsService,
} from '@spryker-oryx/picking/api';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { BapiPushNotificationDefaultAdapter } from './bapi-push-notification-default.adapter';
import { BapiPushNotificationAdapter } from './bapi-push-notification.adapter';

class MockPickingHttpService implements Partial<PickingHttpService> {
  post = vi.fn().mockImplementation(() => of(null));
}

const warehouseUuid = 'warehouseUuid';

class MockWarehouseUserAssignmentsService
  implements Partial<WarehouseUserAssignmentsService>
{
  getUserAssignment = vi.fn().mockReturnValue(
    of({
      warehouse: {
        uuid: warehouseUuid,
      },
    })
  );
}

describe('BapiPushNotificationDefaultAdapter', () => {
  let adapter: BapiPushNotificationAdapter;
  let http: PickingHttpService;
  let warehouseUserAssignmentsService: WarehouseUserAssignmentsService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: BapiPushNotificationAdapter,
          useClass: BapiPushNotificationDefaultAdapter,
        },
        {
          provide: PickingHttpService,
          useClass: MockPickingHttpService,
        },
        {
          provide: WarehouseUserAssignmentsService,
          useClass: MockWarehouseUserAssignmentsService,
        },
      ],
    });

    adapter = testInjector.inject(BapiPushNotificationAdapter);
    http = testInjector.inject(PickingHttpService);
    warehouseUserAssignmentsService = testInjector.inject(
      WarehouseUserAssignmentsService
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(adapter).toBeInstanceOf(BapiPushNotificationDefaultAdapter);
  });

  describe('when "sendSubscription" is called', () => {
    const callback = vi.fn();
    const mockSubscription = 'mockSubscription';

    beforeEach(() => {
      adapter.sendSubscription(mockSubscription).subscribe(callback);
    });

    it('should call the getUserAssignment method of WarehouseUserAssignmentsService', () => {
      expect(
        warehouseUserAssignmentsService.getUserAssignment
      ).toHaveBeenCalled();
    });

    it('should call the post method of PickingHttpService with correct arguments', () => {
      expect(http.post).toHaveBeenCalledWith(
        '/push-notification-subscriptions',
        {
          data: {
            type: 'push-notification-subscriptions',
            attributes: {
              providerName: 'web-push-php',
              group: {
                name: 'warehouse',
                identifier: warehouseUuid,
              },
              payload: mockSubscription,
            },
          },
        }
      );
    });
  });

  describe('when "sendSubscription" is called with no user assignment', () => {
    const mockSubscription = 'mockSubscription';
    const errorCallback = vi.fn();

    beforeEach(() => {
      warehouseUserAssignmentsService.getUserAssignment = vi
        .fn()
        .mockReturnValue(of(null));

      adapter.sendSubscription(mockSubscription).subscribe({
        error: errorCallback,
      });
    });

    it('should call the getUserAssignment method of WarehouseUserAssignmentsService', () => {
      expect(
        warehouseUserAssignmentsService.getUserAssignment
      ).toHaveBeenCalled();
    });

    it('should not call the post method of PickingHttpService', () => {
      expect(http.post).not.toHaveBeenCalled();
    });

    it('should call the error callback', () => {
      expect(errorCallback).toHaveBeenCalledWith(
        new Error('No warehouse user assignment found!')
      );
    });
  });
});
