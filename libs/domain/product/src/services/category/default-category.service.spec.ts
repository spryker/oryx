import { DefaultQueryService, QueryService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import {
  DefaultProductCategoryService,
  ProductCategoryAdapter,
  ProductCategoryService,
  categoryQuery,
} from '@spryker-oryx/product';
import { Observable, of, switchMap, take } from 'rxjs';
import { SpyInstance } from 'vitest';

class MockProductCategoryAdapter implements Partial<ProductCategoryAdapter> {
  get = vi.fn().mockReturnValue(of({ name: `category 1` }));
  getTree = vi.fn().mockReturnValue(
    of([
      { id: '1', name: 'category 1' },
      { id: '2', name: 'category 2' },
      { id: '3', name: 'category 3' },
      { id: '4', name: 'category 4' },
      { id: '5', name: 'category 5' },
    ])
  );
}

describe('DefaultProductCategoryService', () => {
  let service: ProductCategoryService;
  let adapter: ProductCategoryAdapter;

  beforeEach(() => {
    const testInjector = createInjector({
      providers: [
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
        {
          provide: ProductCategoryAdapter,
          useClass: MockProductCategoryAdapter,
        },
        categoryQuery,
        {
          provide: ProductCategoryService,
          useClass: DefaultProductCategoryService,
        },
      ],
    });

    service = testInjector.inject(ProductCategoryService);
    adapter = testInjector.inject(ProductCategoryAdapter);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultProductCategoryService);
  });

  describe('get', () => {
    it('should return an observable', () => {
      expect(service.get({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with a category from adapter', () => {
      const callback = vi.fn();
      service.get({ id: '1' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'category 1' })
      );
    });

    it('should call `get` method of adapter only for getting new category', () => {
      service.get({ id: '123' }).pipe(take(1)).subscribe();
      service.get({ id: '123' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(1);
      service.get({ id: '124' }).pipe(take(1)).subscribe();
      expect(adapter.get).toHaveBeenCalledTimes(2);
    });

    it('should return an observable with undefined if error has been caught', () => {
      (adapter.get as unknown as SpyInstance).mockReturnValue(
        of(null).pipe(
          switchMap(() => {
            throw 'error';
          })
        )
      );
      const callback = vi.fn();
      service.get({}).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getList', () => {
    it('should return an observable', () => {
      expect(service.getList({})).toBeInstanceOf(Observable);
    });

    it('should return an observable with an array of categories from adapter', () => {
      const callback = vi.fn();
      service.getList({ id: '1' }).subscribe(callback);
      expect(callback).toHaveBeenCalledWith(
        expect.objectContaining([{ id: '1', name: 'category 1' }])
      );
    });

    it('should call `getList` method of adapter only once', () => {
      service.getList().pipe(take(1)).subscribe();
      service.getList().pipe(take(1)).subscribe();
      expect(adapter.getTree).toHaveBeenCalledTimes(1);
    });

    describe('when item 2 is excluded', () => {
      it('should return an observable with an array of categories from adapter', () => {
        const callback = vi.fn();
        service.getList({ exclude: '2' }).subscribe(callback);
        expect(callback).toHaveBeenCalledWith(
          expect.not.objectContaining([{ id: '2', name: 'category 2' }])
        );
        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining([
            { id: '1', name: 'category 1' },
            { id: '3', name: 'category 3' },
            { id: '4', name: 'category 4' },
            { id: '5', name: 'category 5' },
          ])
        );
      });
    });

    describe(`when item ['1', '2'] are excluded`, () => {
      it('should return an observable with an array of categories from adapter', () => {
        const callback = vi.fn();
        service.getList({ exclude: ['1', '2'] }).subscribe(callback);
        expect(callback).toHaveBeenCalledWith(
          expect.not.objectContaining([
            { id: '1', name: 'category 1' },
            { id: '2', name: 'category 2' },
          ])
        );
        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining([
            { id: '3', name: 'category 3' },
            { id: '4', name: 'category 4' },
            { id: '5', name: 'category 5' },
          ])
        );
      });

      describe(`when item '1, 2' are excluded`, () => {
        it('should return an observable with an array of categories from adapter', () => {
          const callback = vi.fn();
          service.getList({ exclude: '1, 2' }).subscribe(callback);
          expect(callback).toHaveBeenCalledWith(
            expect.not.objectContaining([
              { id: '1', name: 'category 1' },
              { id: '2', name: 'category 2' },
            ])
          );
          expect(callback).toHaveBeenCalledWith(
            expect.objectContaining([
              { id: '3', name: 'category 3' },
              { id: '4', name: 'category 4' },
              { id: '5', name: 'category 5' },
            ])
          );
        });
      });

      describe(`when item '<2' are excluded`, () => {
        it('should return an observable with an array of categories from adapter', () => {
          const callback = vi.fn();
          service.getList({ exclude: '<2' }).subscribe(callback);
          expect(callback).toHaveBeenCalledWith(
            expect.not.objectContaining([{ id: '1', name: 'category 1' }])
          );
          expect(callback).toHaveBeenCalledWith(
            expect.objectContaining([
              { id: '2', name: 'category 2' },
              { id: '3', name: 'category 3' },
              { id: '4', name: 'category 4' },
              { id: '5', name: 'category 5' },
            ])
          );
        });
      });

      describe(`when item ['<2', '4'] are excluded`, () => {
        it('should return an observable with an array of categories from adapter', () => {
          const callback = vi.fn();
          service.getList({ exclude: ['<2', '4'] }).subscribe(callback);
          expect(callback).toHaveBeenCalledWith(
            expect.not.objectContaining([
              { id: '1', name: 'category 1' },
              { id: '4', name: 'category 4' },
            ])
          );
          expect(callback).toHaveBeenCalledWith(
            expect.objectContaining([
              { id: '2', name: 'category 2' },
              { id: '3', name: 'category 3' },
              { id: '5', name: 'category 5' },
            ])
          );
        });
      });

      describe(`when item '>4' are excluded`, () => {
        it('should return an observable with an array of categories from adapter', () => {
          const callback = vi.fn();
          service.getList({ exclude: '>4' }).subscribe(callback);
          expect(callback).toHaveBeenCalledWith(
            expect.not.objectContaining([{ id: '5', name: 'category 5' }])
          );
          expect(callback).toHaveBeenCalledWith(
            expect.objectContaining([
              { id: '1', name: 'category 1' },
              { id: '2', name: 'category 2' },
              { id: '3', name: 'category 3' },
              { id: '4', name: 'category 4' },
            ])
          );
        });
      });

      describe(`when item [ '2','>4'] are excluded`, () => {
        it('should return an observable with an array of categories from adapter', () => {
          const callback = vi.fn();
          service.getList({ exclude: ['2', '>4'] }).subscribe(callback);
          expect(callback).toHaveBeenCalledWith(
            expect.not.objectContaining([
              { id: '2', name: 'category 2' },
              { id: '5', name: 'category 5' },
            ])
          );
          expect(callback).toHaveBeenCalledWith(
            expect.objectContaining([
              { id: '1', name: 'category 1' },
              { id: '3', name: 'category 3' },
              { id: '4', name: 'category 4' },
            ])
          );
        });
      });

      describe(`when item '2..4' are excluded`, () => {
        it('should return an observable with an array of categories from adapter', () => {
          const callback = vi.fn();
          service.getList({ exclude: '2..4' }).subscribe(callback);
          expect(callback).toHaveBeenCalledWith(
            expect.not.objectContaining([
              { id: '2', name: 'category 2' },
              { id: '3', name: 'category 3' },
              { id: '4', name: 'category 4' },
            ])
          );
          expect(callback).toHaveBeenCalledWith(
            expect.objectContaining([
              { id: '1', name: 'category 1' },
              { id: '5', name: 'category 5' },
            ])
          );
        });
      });
    });
  });
});
