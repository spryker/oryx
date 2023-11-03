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
          if (qualifier && qualifier.id === 1) return of(100);
          else if (qualifier && qualifier.id === 2) return of(200);
          else return throwError(new Error('Invalid ID'));
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
});
