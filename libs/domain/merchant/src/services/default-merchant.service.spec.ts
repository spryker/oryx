import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { merchantQueries } from '@spryker-oryx/merchant';
import { Observable, of, switchMap, take } from 'rxjs';
import { SpyInstance } from 'vitest';
import { MerchantQualifier } from '../models';
import { MerchantAdapter } from './adapter/merchant.adapter';
import { DefaultMerchantService } from './default-merchant.service';
import { MerchantService } from './merchant.service';

class MockMerchantAdapter implements Partial<MerchantAdapter> {
  get = vi
    .fn()
    .mockImplementation((qualifier: MerchantQualifier) =>
      of({ name: `adapter ${qualifier.id}` })
    );
}

describe('DefaultMerchantService', () => {
  let service: MerchantService;
  let adapter: MerchantAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: MerchantService,
          useClass: DefaultMerchantService,
        },
        {
          provide: MerchantAdapter,
          useClass: MockMerchantAdapter,
        },
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
        ...merchantQueries,
      ],
    });

    service = testInjector.inject(MerchantService);
    adapter = testInjector.inject(MerchantAdapter);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultMerchantService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a merchant from adapter', () => {
      const callback = vi.fn();
      service.get({ id: '123' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'adapter 123' })
      );
    });

    it('should call `get` method of adapter only for getting new merchant', () => {
      service.get({ id: '123' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ id: '123' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ id: '124' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with undefined if error has been caught', () => {
      (adapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw new Error('error');
          })
        )
      );
      const callback = vi.fn();
      service.get({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getState', () => {
    it('should return an observable', () => {
      expect(service.getState({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a merchant state from adapter', () => {
      const callback = vi.fn();
      service.getState({ id: '123' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: 'adapter 123' } })
      );
    });

    it('should call `get` method of adapter only for getting new merchant state', () => {
      service.getState({ id: '123' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getState({ id: '123' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.getState({ id: '124' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with error state if error has been caught', () => {
      const testError = new Error('test error');
      (adapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw testError;
          })
        )
      );
      const callback = vi.fn();
      service.getState({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ data: undefined, error: testError })
      );
    });
  });
});
