import { QueryService } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { AlertType } from '@spryker-oryx/ui';
import { Observable, Subject, of } from 'rxjs';
import { NotificationService } from '../notification';
import { DefaultPriceModeService } from './default-price-mode.service';
import {
  PriceMode,
  PriceModeChangeGuard,
  PriceModeService,
} from './price-mode.service';

class MockQueryService implements Partial<QueryService> {
  emit = vi.fn();
}

const notificationTrigger$ = new Subject();

class MockNotificationService implements Partial<NotificationService> {
  get = vi.fn().mockReturnValue(notificationTrigger$);
  push = vi.fn();
}

describe.only('DefaultPriceModeService', () => {
  let service: PriceModeService;
  let notificationService: NotificationService;

  let testInjector;

  beforeEach(() => {
    testInjector = new Injector([
      {
        provide: PriceModeService,
        useClass: DefaultPriceModeService,
      },
      {
        provide: QueryService,
        useClass: MockQueryService,
      },
      {
        provide: NotificationService,
        useClass: MockNotificationService,
      },
      {
        provide: PriceMode,
        useValue: 'GROSS_MODE',
      },
      {
        provide: PriceModeChangeGuard,
        useValue: {
          isAllowed: () => of(true),
        },
      },
    ]);

    service = testInjector.inject(PriceModeService);
    notificationService = testInjector.inject(NotificationService);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultPriceModeService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get()).toBeInstanceOf(Observable);
    });

    it('should return an observable with default price mode', () => {
      const callback = vi.fn();
      service.get().subscribe(callback);
      expect(callback).toHaveBeenCalledWith('GROSS_MODE');
    });
  });

  describe('set', () => {
    it('should set new price mode', () => {
      const mock = 'NET_MODE';
      const setObservable = service.set(mock);

      setObservable.subscribe(() => {
        () => {
          const newValue = service.get();
          expect(newValue).toEqual(mock);
        };
      });
    });

    it('should return the same price mode if it is currently selected', () => {
      const mock = 'GROSS_MODE';
      const setObservable = service.set(mock);

      setObservable.subscribe(() => {
        () => {
          const newValue = service.get();
          expect(newValue).toEqual(mock);
        };
      });
    });
  });

  describe('if price mode change is not allowed', () => {
    beforeEach(() => {
      testInjector = new Injector([
        {
          provide: PriceModeService,
          useClass: DefaultPriceModeService,
        },
        {
          provide: QueryService,
          useClass: MockQueryService,
        },
        {
          provide: NotificationService,
          useClass: MockNotificationService,
        },
        {
          provide: PriceMode,
          useValue: 'GROSS_MODE',
        },
        {
          provide: PriceModeChangeGuard,
          useValue: {
            isAllowed: () => of(false),
          },
        },
      ]);

      service = testInjector.inject(PriceModeService);
      notificationService = testInjector.inject(NotificationService);
    });

    it('should send a notification error', () => {
      const mock = 'NET_MODE';
      const setObservable = service.set(mock);

      setObservable.subscribe({
        complete: () => {
          expect(notificationService.push).toHaveBeenCalledWith({
            type: AlertType.Error,
            content: 'Error',
            subtext: 'Can’t switch price mode when there are items in the cart',
          });
        },
      });
    });
  });
});
