import { rxjsTestScheduler } from '@spryker-oryx/core/testing';
import { delay, firstValueFrom, merge, of, throwError } from 'rxjs';
import { CommandOptions, CommandStrategy } from '../models';
import { CoreCommand } from './core-command';
import { CoreQueryManager } from './core-query-manager';

describe('Core Command', () => {
  const queryManager = new CoreQueryManager();

  function createCommand(options: CommandOptions<any, any>) {
    return new CoreCommand(options, queryManager);
  }

  describe('Execute', () => {
    it('should return result', async () => {
      const expectedResult = 'testResult';
      const command = createCommand({ action: () => of(expectedResult) });
      const resultPromise = firstValueFrom(command.execute(undefined));

      const result = await resultPromise;
      expect(result).toEqual(expectedResult);
    });

    it('should error on error', async () => {
      expect.assertions(1);
      const expectedError = new Error('testError');
      const command = createCommand({
        action: () => throwError(expectedError),
      });
      const resultPromise = firstValueFrom(command.execute(undefined));

      try {
        await resultPromise;
      } catch (err) {
        expect(err).toEqual(expectedError);
      }
    });
  });

  describe('Strategy', () => {
    describe('Queue', () => {
      it('should queue commands', () => {
        rxjsTestScheduler().run(({ expectObservable, cold }) => {
          const command = createCommand({
            action: ({ test }) => cold('--a|', { a: test }),
            strategy: CommandStrategy.Queue,
          });

          const results$ = merge(
            command.execute({ test: 'test1' }),
            command.execute({ test: 'test2' })
          );
          expectObservable(results$).toBe('--a--b|', {
            a: 'test1',
            b: 'test2',
          });
        });
      });
    });

    describe('Parallel', () => {
      it('should run commands in parallel', () => {
        rxjsTestScheduler().run(({ cold, expectObservable }) => {
          const command = createCommand({
            action: () => cold('----a|', { a: 'test2' }),
            strategy: CommandStrategy.Parallel,
          });

          const results$ = merge(
            command.execute(undefined),
            command.execute(undefined).pipe(delay(2))
          );
          expectObservable(results$).toBe('----a-(b|)', {
            a: 'test2',
            b: 'test2',
          });
        });
      });

      it('should execute second command even when first execution errors', () => {
        rxjsTestScheduler().run(({ cold, expectObservable }) => {
          const command = createCommand({
            action: (qualifier) => {
              if (qualifier === '1') {
                return throwError(() => new Error('testError'));
              }

              return cold('----a|', { a: 'test2' });
            },
            strategy: CommandStrategy.Parallel,
          });

          const firstExecution$ = command.execute('1');
          const secondExecution$ = command.execute('2');

          expectObservable(firstExecution$).toBe(
            '#',
            null,
            new Error('testError')
          );
          expectObservable(secondExecution$).toBe('----a|', { a: 'test2' });
        });
      });
    });

    describe('Replace', () => {
      it('should replace running command', () => {
        const sheduler = rxjsTestScheduler();
        sheduler.run(({ cold, expectObservable }) => {
          const command = createCommand({
            action: (qualifier) => cold(`---a|`, { a: `${qualifier}_test` }),
            strategy: CommandStrategy.Replace,
          });

          const firstExecution$ = command.execute('1');

          sheduler.schedule(() => {
            const secondExecution$ = command.execute('2');
            expectObservable(secondExecution$).toBe('----a|', { a: '2_test' });
          }, 1);

          expectObservable(firstExecution$).toBe('-|');
        });
      });
    });

    describe('Override', () => {
      it('should override running command', () => {
        const sheduler = rxjsTestScheduler();
        sheduler.run(({ cold, expectObservable }) => {
          const command = createCommand({
            action: (qualifier) => cold(`---a|`, { a: `${qualifier}_test` }),
            strategy: CommandStrategy.Override,
          });

          const firstExecution$ = command.execute('1');

          sheduler.schedule(() => {
            const secondExecution$ = command.execute('2');
            expectObservable(secondExecution$).toBe('----a|', { a: '2_test' });
          }, 1);

          expectObservable(firstExecution$).toBe(
            '-#',
            null,
            'Command cancelled'
          );
        });
      });
    });

    describe('Skip', () => {
      it('should skip if a command is already running', () => {
        rxjsTestScheduler().run(({ cold, expectObservable }) => {
          const command = createCommand({
            action: (qualifier) => cold(`-a|`, { a: `${qualifier}_test` }),
            strategy: CommandStrategy.Skip,
          });

          const firstExecution$ = command.execute('1');
          const secondExecution$ = command.execute('2');

          expectObservable(firstExecution$).toBe('-a|', { a: '1_test' });
          expectObservable(secondExecution$).toBe('|');
        });
      });
    });

    describe('Cancel', () => {
      it('should cancel if a command is already running', () => {
        rxjsTestScheduler().run(({ cold, expectObservable }) => {
          const command = createCommand({
            action: (qualifier) => cold(`-a|`, { a: `${qualifier}_test` }),
            strategy: CommandStrategy.Cancel,
          });

          const firstExecution$ = command.execute('1');
          const secondExecution$ = command.execute('2');

          expectObservable(firstExecution$).toBe('-a|', { a: '1_test' });
          expectObservable(secondExecution$).toBe(
            '#',
            null,
            'Command cancelled'
          );
        });
      });
    });
  });

  describe('Events', () => {
    it('onStart should be dispatched', async () => {
      let onStartCalled = false;
      const command = createCommand({
        action: () => of('test'),
        onStart: [
          () => {
            onStartCalled = true;
          },
        ],
      });

      await firstValueFrom(command.execute(undefined));
      expect(onStartCalled).toBeTruthy();
    });

    it('onFinish should be dispatched', async () => {
      let onFinishCalled = false;
      const command = createCommand({
        action: () => of('test'),
        onFinish: [
          () => {
            onFinishCalled = true;
          },
        ],
      });

      await firstValueFrom(command.execute(undefined));
      expect(onFinishCalled).toBeTruthy();
    });

    it('onError should be dispatched', async () => {
      expect.assertions(1);
      let onErrorCalled = false;
      const command = createCommand({
        action: () => throwError(new Error('test')),
        onError: [
          () => {
            onErrorCalled = true;
          },
        ],
      });

      try {
        await firstValueFrom(command.execute(undefined));
      } catch {
        expect(onErrorCalled).toBeTruthy();
      }
    });

    it('onSuccess should be dispatched', async () => {
      let onSuccessCalled = false;
      const command = createCommand({
        action: () => of('test'),
        onSuccess: [
          () => {
            onSuccessCalled = true;
          },
        ],
      });

      await firstValueFrom(command.execute(undefined));
      expect(onSuccessCalled).toBeTruthy();
    });
  });
});
