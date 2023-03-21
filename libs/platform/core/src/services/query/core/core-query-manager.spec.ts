import { CoreCommand, CoreQuery } from '@spryker-oryx/core';
import { of, Subject, take } from 'rxjs';
import { CoreQueryManager } from './core-query-manager';

describe('CoreQueryManager', () => {
  let queryManager: CoreQueryManager;

  beforeEach(() => {
    queryManager = new CoreQueryManager();
  });

  describe('createQuery', () => {
    it('should return query', () => {
      const query = queryManager.createQuery({ loader: () => of(42) });
      expect(query).toBeDefined();
      expect(query.get).toBeDefined();
      expect(query).toBeInstanceOf(CoreQuery);
    });
  });

  describe('getQuery', () => {
    it('should return query by id', () => {
      const expected = queryManager.createQuery({
        id: 'testQuery',
        loader: () => of(42),
      });
      const query = queryManager.getQuery('testQuery');
      expect(query).toBeDefined();
      expect(query).toBe(expected);
    });
  });

  describe('createCommand', () => {
    it('should create command', () => {
      const command = queryManager.createCommand({ action: () => of(42) });
      expect(command).toBeDefined();
      expect(command.execute).toBeDefined();
      expect(command).toBeInstanceOf(CoreCommand);
    });
  });

  describe('getCommand', () => {
    it('should return command by id', () => {
      const expected = queryManager.createCommand({
        id: 'testCommand',
        action: () => of(42),
      });
      const command = queryManager.getCommand('testCommand');
      expect(command).toBeDefined();
      expect(command).toBe(expected);
    });
  });

  describe('createEffect', () => {
    it('should return effect stream', () => {
      const mockEffect = vi.fn().mockReturnValue(of('testEffect'));
      const effectStream = queryManager.createEffect(mockEffect);
      expect(effectStream).toBeDefined();
      expect(mockEffect).toHaveBeenCalled();
    });

    it('should subscribe to effect', () => {
      const effect$ = new Subject();
      const spy = vi.spyOn(effect$, 'subscribe');
      queryManager.createEffect(() => effect$);
      expect(spy).toHaveBeenCalled();
    });

    it('should allow to unsubscribe / dispose effect', () => {
      const effect$ = new Subject();
      const effect = queryManager.createEffect(() => effect$);
      effect.unsubscribe();
      expect(effect$.observers.length).toBe(0);
    });
  });

  describe('emit', () => {
    it('should emit an event', () => {
      const callback = vi.fn();
      queryManager.getEvents().pipe(take(1)).subscribe(callback);
      queryManager.emit({ type: 'testEvent' });
      expect(callback).toHaveBeenCalledWith({ type: 'testEvent' });
    });
  });

  describe('getEvents', () => {
    it('should return event stream', () => {
      const events$ = queryManager.getEvents();
      expect(events$).toBeDefined();
    });

    it('should return filtered event stream', () => {
      const events$ = queryManager.getEvents('testEvent');
      const event = { type: 'testEvent' };
      const callback = vi.fn();
      events$.pipe(take(1)).subscribe(callback);
      queryManager.emit(event);
      expect(callback).toHaveBeenCalledWith(event);
    });
  });

  describe('dispose', () => {
    it('should stop effects', () => {
      const effect$ = new Subject();
      queryManager.createEffect(() => effect$);
      const spy = vi.spyOn(queryManager['destroy$'], 'next');
      queryManager.dispose();
      expect(spy).toHaveBeenCalled();
    });
  });
});
