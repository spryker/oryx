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

/*

import { QueryManager } from './query-manager'; // Assuming this is the correct path
import { Subject } from 'rxjs';

describe('QueryManager', () => {

  describe('createQuery', () => {
    it('should return query', () => {
      const query = queryManager.createQuery({
        id: 'test_query',
        initialValue: 'test_value',
      });
      expect(query).toBeDefined();
    });
  });

  describe('getQuery', () => {
    it('should return query by id', () => {
      const query = queryManager.createQuery({
        id: 'test_query',
        initialValue: 'test_value',
      });
      const retrievedQuery = queryManager.getQuery('test_query');
      expect(retrievedQuery).toBe(query);
    });
  });

  describe('createCommand', () => {
    it('should create command', () => {
      const command = queryManager.createCommand({
        id: 'test_command',
        execute: jest.fn(),
      });
      expect(command).toBeDefined();
    });
  });

  describe('getCommand', () => {
    it('should return command by id', () => {
      const command = queryManager.createCommand({
        id: 'test_command',
        execute: jest.fn(),
      });
      const retrievedCommand = queryManager.getCommand('test_command');
      expect(retrievedCommand).toBe(command);
    });
  });

  describe('createEffect', () => {
    it('should return effect stream', () => {
      const effectStream = new Subject();
      const effectDefinition = {
        stream: effectStream,
        effect: jest.fn(),
      };
      queryManager.createEffect(effectDefinition);
      expect(queryManager.getEvents('effect_stream')).toBeDefined();
    });

    it('should subscribe to effect', () => {
      const effectStream = new Subject();
      const effectSpy = jest.fn();
      const effectDefinition = {
        stream: effectStream,
        effect: effectSpy,
      };
      queryManager.createEffect(effectDefinition);
      effectStream.next('test_value');
      expect(effectSpy).toHaveBeenCalledWith('test_value');
    });

    it('should allow to unsubscribe / dispose effect', () => {
      const effectStream = new Subject();
      const effectSpy = jest.fn();
      const effectDefinition = {
        stream: effectStream,
        effect: effectSpy,
      };
      queryManager.createEffect(effectDefinition);
      queryManager.dispose();
      effectStream.next('test_value');
      expect(effectSpy).not.toHaveBeenCalledWith('test_value');
    });
  });

  describe('emit', () => {
    it('should emit an event', () => {
      const eventSpy = jest.fn();
      const event = { type: 'test_event', payload: 'test_value' };

      queryManager.getEvents().subscribe(eventSpy);
      queryManager.emit(event);
      expect(eventSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('getEvents', () => {
    it('should return event stream', () => {
      const eventStream = queryManager.getEvents();
      expect(eventStream).toBeDefined();
    });

    it('should return filtered event stream', () => {
      const eventSpy = jest.fn();
      const event = { type: 'test_event', payload: 'test_value' };

      queryManager.getEvents('test_event').subscribe(eventSpy);
      queryManager.emit(event);
      expect(eventSpy).toHaveBeenCalledWith(event);

      eventSpy.mockReset();
      queryManager.emit({ type: 'another_event', payload:


 */

// describe('CoreQueryService', () => {
//   let service: CoreQueryService;
//
//   beforeEach(() => {
//     service = new CoreQueryService();
//   });
//
//   afterEach(() => {
//     service.dispose();
//   });
//
//   describe('createQuery', () => {
//     it('should create a query with the given options and add it to the queries map', () => {
//       const options: QueryOptions<string> = {
//         id: 'test-query',
//         query: () => 'test',
//       };
//
//       const query = service.createQuery(options);
//
//       expect(query).toBeDefined();
//       expect(service.getQuery('test-query')).toBe(query);
//     });
//   });
//
//   describe('getQuery', () => {
//     it('should return the query with the given id if it exists', () => {
//       const options: QueryOptions<string> = {
//         id: 'test-query',
//         query: () => 'test',
//       };
//
//       service.createQuery(options);
//
//       const query = service.getQuery('test-query');
//
//       expect(query).toBeDefined();
//       expect(query?.id).toBe('test-query');
//     });
//
//     it('should return undefined if the query with the given id does not exist', () => {
//       const query = service.getQuery('nonexistent-query');
//
//       expect(query).toBeUndefined();
//     });
//   });
//
//   describe('createCommand', () => {
//     it('should create a command with the given options and add it to the commands map', () => {
//       const options: CommandOptions<string> = {
//         id: 'test-command',
//         command: () => 'test',
//       };
//
//       const command = service.createCommand(options);
//
//       expect(command).toBeDefined();
//       expect(service.getCommand('test-command')).toBe(command);
//     });
//   });
//
//   describe('getCommand', () => {
//     it('should return the command with the given id if it exists', () => {
//       const options: CommandOptions<string> = {
//         id: 'test-command',
//         command: () => 'test',
//       };
//
//       service.createCommand(options);
//
//       const command = service.getCommand('test-command');
//
//       expect(command).toBeDefined();
//       expect(command?.id).toBe('test-command');
//     });
//
//     it('should return undefined if the command with the given id does not exist', () => {
//       const command = service.getCommand('nonexistent-command');
//
//       expect(command).toBeUndefined();
//     });
//   });
// });
//
// import { of } from 'rxjs';
// import { delay } from 'rxjs/operators';
//
// describe('CoreQueryService', () => {
//   let queryService: CoreQueryService;
//
//   beforeEach(() => {
//     queryService = new CoreQueryService();
//   });
//
//   afterEach(() => {
//     queryService.dispose();
//   });
//
//   describe('createEffect', () => {
//     it('should call a stream effect and retry on error', () => {
//       const streamEffect = vi.fn().mockReturnValue(of(null).pipe(delay(100)));
//       queryService.createEffect(streamEffect);
//       expect(streamEffect).toHaveBeenCalled();
//       vi.advanceTimersByTime(101);
//       expect(streamEffect).toHaveBeenCalledTimes(2);
//     });
//
//     it('should call a callback effect and retry on error', () => {
//       const callbackEffect = ['eventName', vi.fn()];
//       queryService.createEffect(callbackEffect);
//       queryService.emit({ type: 'eventName' });
//       expect(callbackEffect[1]).toHaveBeenCalled();
//       vi.spyOn(console, 'error').mockImplementation(() => {});
//       queryService.emit({ type: 'eventName' });
//       expect(callbackEffect[1]).toHaveBeenCalledTimes(2);
//       expect(console.error).toHaveBeenCalled();
//     });
//   });
//
//   describe('emit', () => {
//     it('should emit an event to the stateEvents$ subject', (done) => {
//       const event = { type: 'testEvent' };
//       queryService.getEvents('testEvent').subscribe({
//         next: (result) => {
//           expect(result).toEqual(event);
//           done();
//         },
//       });
//       queryService.emit(event);
//     });
//   });
//
//   describe('getEvents', () => {
//     it('should return all events if no eventType is specified', (done) => {
//       const events = [
//         { type: 'eventA', data: { value: 'A' } },
//         { type: 'eventB', data: { value: 'B' } },
//         { type: 'eventC', data: { value: 'C' } },
//       ];
//       const expectedResults = [events[0], events[1], events[2]];
//       let count = 0;
//       queryService.getEvents().subscribe({
//         next: (result) => {
//           expect(result).toEqual(expectedResults[count]);
//           count++;
//           if (count === 3) {
//             done();
//           }
//         },
//       });
//       queryService.emit(events[0]);
//       queryService.emit(events[1]);
//       queryService.emit(events[2]);
//     });
//
//     it('should return only events of the specified eventType', (done) => {
//       const events = [
//         { type: 'eventA', data: { value: 'A' } },
//         { type: 'eventB', data: { value: 'B' } },
//         { type: 'eventC', data: { value: 'C' } },
//       ];
//       const expectedResults = [events[0], events[2]];
//       let count = 0;
//       queryService.getEvents('eventA').subscribe({
//         next: (result) => {
//           expect(result).toEqual(expectedResults[count]);
//           count++;
//           if (count === 2) {
//             done();
//           }
//         },
//       });
//       queryService.emit(events[0]);
//       queryService.emit(events[1]);
//       queryService.emit(events[2]);
//     });
//   });
// });
