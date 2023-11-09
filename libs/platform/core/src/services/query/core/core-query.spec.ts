import { firstValueFrom, Observable, of, Subject, throwError } from 'rxjs';
import { describe } from 'vitest';
import { CoreQuery } from './core-query';
import { QueryManager } from './query-manager';

class MockQueryManager implements Partial<QueryManager> {}

describe('CoreQuery', () => {
  let queryManager: QueryManager;
  let coreQuery: CoreQuery<any, any>;

  beforeEach(() => {
    queryManager = new MockQueryManager() as QueryManager;
    coreQuery = new CoreQuery(
      {
        loader: (qualifier) => {
          if (qualifier && qualifier.id === 1) {
            return of(100);
          } else if (qualifier && qualifier.id === 2) {
            return of(200);
          } else {
            return throwError(new Error('Invalid ID'));
          }
        },
      },
      queryManager
    );
  });

  describe('get', () => {
    it('should get data for valid qualifier', async () => {
      const data = await firstValueFrom(coreQuery.get({ id: 1 }));
      expect(data).toBe(100);
    });
  });

  describe('getState', () => {
    it('should get state for valid qualifier', async () => {
      const state = await firstValueFrom(coreQuery.getState({ id: 1 }));
      expect(state.data).toBe(100);
      expect(state.error).toBeFalsy();
      expect(state.loading).toBeFalsy();
    });

    it('should expose error', async () => {
      const state = await firstValueFrom(coreQuery.getState({ id: 3 }));

      expect(state.data).toBeUndefined();
      expect(state.error).toBeInstanceOf(Error);
      expect(state.loading).toBeFalsy();
    });
  });

  describe('set', () => {
    it('should set data for valid qualifier', async () => {
      coreQuery.set({ data: 300, qualifier: { id: 1 } });
      const data = await firstValueFrom(coreQuery.get({ id: 1 }));
      expect(data).toBe(300);
    });
  });

  describe('Trigger', () => {
    describe('resetOn', () => {
      it('should trigger reset', async () => {
        const resetTrigger = new Subject();
        coreQuery = new CoreQuery(
          {
            loader: (qualifier) => of(100),
            resetOn: [resetTrigger],
          },
          queryManager
        );
        await firstValueFrom(coreQuery.get({ id: 1 }));
        coreQuery.set({ data: 300, qualifier: { id: 1 } });
        resetTrigger.next(undefined);
        const data = await firstValueFrom(coreQuery.get({ id: 1 }));
        expect(data).toBe(100);
      });
    });

    describe('refreshOn', () => {
      it('should trigger refresh', async () => {
        const refreshTrigger = new Subject();
        const loader = vi.fn((qualifier) => of(100));
        coreQuery = new CoreQuery(
          {
            loader,
            refreshOn: [refreshTrigger],
          },
          queryManager
        );
        await firstValueFrom(coreQuery.get({ id: 1 }));
        refreshTrigger.next(undefined);
        await firstValueFrom(coreQuery.get({ id: 1 }));
        expect(loader).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Event', () => {
    describe('onLoad', () => {
      it('should be dispatched', async () => {
        const onLoadCallback = vi.fn();
        coreQuery = new CoreQuery(
          {
            loader: (qualifier) => of(100),
            onLoad: [onLoadCallback],
          },
          queryManager
        );
        await firstValueFrom(coreQuery.get({ id: 1 }));
        expect(onLoadCallback).toHaveBeenCalledTimes(1);
      });
    });

    describe('onError', () => {
      it('should be dispatched', async () => {
        const onErrorCallback = vi.fn();
        coreQuery = new CoreQuery(
          {
            loader: (qualifier) =>
              throwError(new Error('Invalid ID')) as Observable<any>,
            onError: [onErrorCallback],
          },
          queryManager
        );
        try {
          await firstValueFrom(coreQuery.get({ id: 1 }));
        } catch (error) {
          // Do nothing
        }
        expect(onErrorCallback).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('CoreQuery with cacheKey', () => {
    let coreQuery: CoreQuery<any, any>;
    let loader: any;

    beforeEach(() => {
      loader = vi.fn((qualifier) => {
        return of(`Data for ${qualifier.id}`);
      });

      coreQuery = new CoreQuery(
        {
          loader,
          cacheKey: (qualifier) => `cache_for_${qualifier.type}`,
        },
        queryManager
      );
    });

    it('should return the same data for different qualifiers with the same cache key', async () => {
      const firstQualifier = { id: 1, type: 'common' };
      const secondQualifier = { id: 2, type: 'common' };

      const firstData = await firstValueFrom(coreQuery.get(firstQualifier));
      const secondData = await firstValueFrom(coreQuery.get(secondQualifier));

      expect(loader).toHaveBeenCalledTimes(1);
      expect(firstData).toBe(secondData);
    });

    it('should return the different data for different qualifiers with different cache key', async () => {
      const firstQualifier = { id: 1, type: 'common' };
      const secondQualifier = { id: 2, type: 'special' };

      const firstData = await firstValueFrom(coreQuery.get(firstQualifier));
      const secondData = await firstValueFrom(coreQuery.get(secondQualifier));

      expect(loader).toHaveBeenCalledTimes(2);
      expect(firstData).not.toBe(secondData);
    });
  });

  describe('postTransforms', () => {
    it('should apply postTransforms to the data', async () => {
      const postTransformFn = vi.fn((data) => data + 1);
      coreQuery = new CoreQuery(
        {
          loader: (qualifier) => of(qualifier.id * 100),
          postTransforms: [postTransformFn],
        },
        queryManager
      );

      const dataWithoutTransform = await firstValueFrom(
        coreQuery.get({ id: 1 })
      );
      expect(dataWithoutTransform).toBe(101);
      expect(postTransformFn).toHaveBeenCalledTimes(1);

      const stateWithTransform = await firstValueFrom(
        coreQuery.getState({ id: 1 })
      );
      expect(stateWithTransform.data).toBe(101);
      expect(postTransformFn).toHaveBeenCalledTimes(2);
    });
  });
});
