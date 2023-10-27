import { QueryService } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Observable } from 'rxjs';
import { DefaultPriceModeService } from './default-price-mode.service';
import { PriceMode, PriceModeService } from './price-mode.service';

class MockQueryService implements Partial<QueryService> {
  emit = vi.fn();
}

describe('DefaultPriceModeService', () => {
  let service: PriceModeService;
  let queryService: QueryService;

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
        provide: PriceMode,
        useValue: 'GROSS_MODE',
      },
    ]);

    service = testInjector.inject(PriceModeService);
    queryService = testInjector.inject(QueryService);
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

    it('should set price mode', () => {
      const mock = 'NET_MODE';
      const callback = vi.fn();

      service.get().subscribe(callback);
      service.set(mock);

      expect(callback).toHaveBeenCalledWith(mock);
      expect(queryService.emit).toHaveBeenCalled();
    });

    it('should not emit query service if price mode is current one', () => {
      const mock = 'GROSS_MODE';
      const callback = vi.fn();

      service.set(mock);

      expect(callback).not.toHaveBeenCalledWith(mock);
      expect(queryService.emit).not.toHaveBeenCalled();
    });
  });
});
