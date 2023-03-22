import {
  DefaultQueryService,
  provideCommand,
  provideEffect,
  provideQuery,
  QueryService,
} from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { firstValueFrom, of } from 'rxjs';
import { Mock } from 'vitest';

describe('DefaultQueryService', () => {
  let service: DefaultQueryService;
  let testEffect: Mock;

  beforeEach(() => {
    testEffect = vi.fn().mockReturnValue(of('testEffect'));

    const testInjector = createInjector({
      providers: [
        {
          provide: QueryService,
          useClass: DefaultQueryService,
        },
        provideEffect(testEffect),
        provideQuery('testQuery', () => ({ loader: () => of('testValue') })),
        provideCommand('testCommand', () => ({
          action: () => of('testResult'),
        })),
      ],
    });

    service = testInjector.inject(QueryService) as DefaultQueryService;
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultQueryService);
  });

  describe('Provided Effects', () => {
    it('should be initiated', () => {
      expect(testEffect).toHaveBeenCalled();
    });
  });

  describe('Provided Queries', () => {
    it('should be returned', async () => {
      const query = service.getQuery('testQuery');
      expect(query).toBeDefined();
      expect(await firstValueFrom(query!.get(undefined))).toBe('testValue');
    });
  });

  describe('Provided Commands', () => {
    it('should be returned', () => {
      const command = service.getCommand('testCommand');
      expect(command).toBeDefined();
      expect(command?.execute).toBeDefined();
    });
  });

  describe('onDestroy', () => {
    it('should call dispose on query manager', () => {
      const disposeSpy = vi.spyOn(service, 'dispose');
      service.onDestroy();
      expect(disposeSpy).toHaveBeenCalled();
    });
  });
});
