import { AuthService } from '@spryker-oryx/auth';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { OrderService } from '../order.service';
import {
  DefaultGuestStorageInitializer,
  GuestStorageInitializer,
} from './guest-storage.initializer';

class MockAuthService implements Partial<AuthService> {
  isAuthenticated = vi.fn().mockReturnValue(of(false));
}

class MockOrderService implements Partial<OrderService> {
  clearLastOrder = vi.fn();
}

describe('DefaultGuestStorageInitializer', () => {
  let service: DefaultGuestStorageInitializer;
  let authService: MockAuthService;
  let orderService: MockOrderService;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: OrderService, useClass: MockOrderService },
        {
          provide: GuestStorageInitializer,
          useClass: DefaultGuestStorageInitializer,
        },
      ],
    });

    service = testInjector.inject(GuestStorageInitializer);
    authService = testInjector.inject(
      AuthService
    ) as unknown as MockAuthService;
    orderService = testInjector.inject(
      OrderService
    ) as unknown as MockOrderService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be defined', () => {
    expect(service).toBeInstanceOf(DefaultGuestStorageInitializer);
  });

  describe('when the user is not authenticated', () => {
    it('should not call order service clearLastOrder', () => {
      service.initialize();
      expect(orderService.clearLastOrder).not.toHaveBeenCalled();
    });
  });

  describe('when the user is authenticated', () => {
    beforeEach(() => {
      authService.isAuthenticated.mockReturnValue(of(true));
    });

    it('should call order service clearLastOrder', () => {
      service.initialize();
      expect(orderService.clearLastOrder).toHaveBeenCalled();
    });
  });
});
