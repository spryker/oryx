import { IdentityService } from '@spryker-oryx/auth';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { OrderAdapter } from './adapter';
import { DefaultOrderService } from './default-order.service';
import { OrderService } from './order.service';

const mockOrderData = {
  id: 'mockid',
  items: [],
  totals: [],
  expenses: [],
  currencyIsoCode: 'DE',
  createdAt: 'mockdate',
};

class MockOrderAdapter implements Partial<OrderAdapter> {
  get = vi.fn().mockReturnValue(of(mockOrderData));
}

class MockIdentityService implements Partial<IdentityService> {
  get = vi.fn().mockReturnValue(of({}));
}

const mockGetOrderProps = { id: 'mockid' };

describe('DefaultOrderService', () => {
  let service: OrderService;
  let adapter: MockOrderAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: OrderService,
          useClass: DefaultOrderService,
        },
        {
          provide: OrderAdapter,
          useClass: MockOrderAdapter,
        },
        {
          provide: IdentityService,
          useClass: MockIdentityService,
        },
      ],
    });

    service = testInjector.inject(OrderService);
    adapter = testInjector.inject(OrderAdapter) as MockOrderAdapter;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultOrderService);
  });

  describe('when get is called', () => {
    const cb = vi.fn();
    beforeEach(() => {
      service.get(mockGetOrderProps).subscribe(cb);
    });

    it('should return an observable', () => {
      expect(service.get(mockGetOrderProps)).toBeInstanceOf(Observable);
    });

    it('should call adapter', () => {
      expect(adapter.get).toHaveBeenCalledWith(mockGetOrderProps);
    });

    describe('and get is called with the same id', () => {
      it('should not call the adapter', () => {
        service.get(mockGetOrderProps).subscribe();
        expect(adapter.get).toHaveBeenCalledTimes(1);
      });
    });
  });
});
