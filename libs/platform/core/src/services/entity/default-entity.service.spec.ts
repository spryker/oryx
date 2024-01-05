import { EntityContext, provideEntity } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { firstValueFrom, of } from 'rxjs';
import { ContextService } from '../context';
import { DefaultEntityService } from './default-entity.service';
import { EntityService } from './entity.service';

const mockResult: any = {
  result: 'data',
  nested: {
    field: 'nestedValue',
  },
};

const mockTestService = {
  get: vi.fn((qualifier) => of(mockResult)),
  getCustom: vi.fn((qualifier) => of({ customData: qualifier } as any)),
};
const mockContextService = {
  get: vi.fn((element, context) => of('mockQualifier')),
};

describe('DefaultEntityService', () => {
  let service: EntityService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: 'MockTestService',
          useValue: mockTestService,
        },
        provideEntity('testType', {
          service: 'MockTestService',
          context: 'mockContext',
        }),
        provideEntity('customType', {
          service: 'MockTestService',
          context: 'mockContext',
          get: (service: any, qualifier: any) => service.getCustom(qualifier),
        }),
        {
          provide: ContextService,
          useValue: mockContextService,
        },
        {
          provide: EntityService,
          useClass: DefaultEntityService,
        },
      ],
    });

    service = getInjector().inject(EntityService);
  });
  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('get method', () => {
    it('should return entity data', async () => {
      const data = await firstValueFrom(service.get({ type: 'testType' }));
      expect(data).toEqual(mockResult);
    });

    it('should handle missing entity provider', async () => {
      await expect(
        firstValueFrom(service.get({ type: 'unknownType' }))
      ).rejects.toThrow('No entity provider found');
    });
  });

  describe('getField method', () => {
    it('should return specific field data', async () => {
      const data = await firstValueFrom(
        service.getField({ type: 'testType', field: 'result' })
      );
      expect(data).toBe('data');
    });

    it('should return nested field data', async () => {
      const data = await firstValueFrom(
        service.getField({ type: 'testType', field: 'nested.field' })
      );
      expect(data).toBe('nestedValue');
    });
  });

  describe('get method with CustomEntityProvider', () => {
    it('should use custom provider logic for entity resolution', async () => {
      const result = await firstValueFrom(
        service.get({ type: 'customType', qualifier: 'someQualifier' })
      );
      expect(result).toEqual({ customData: 'someQualifier' });
    });
  });

  describe('get method with type inference', () => {
    it('should fetch type from context and return entity data', async () => {
      mockContextService.get.mockImplementation((element, context) =>
        of('testType')
      );
      const data = await firstValueFrom(
        service.get({ element: 'someElement' as any })
      );
      expect(mockContextService.get).toHaveBeenCalledWith(
        'someElement',
        EntityContext
      );
      expect(data).toEqual(mockResult);
    });

    it('should throw an error when type cannot be resolved from context', async () => {
      mockContextService.get.mockImplementation((element, context) =>
        of(undefined as any)
      );

      await expect(
        firstValueFrom(service.get({ element: 'unknownElement' as any }))
      ).rejects.toThrow('No type resolved and no type provided for entity');
    });
  });

  describe('getQualifier method', () => {
    it('should return the correct qualifier', async () => {
      mockContextService.get.mockImplementation((element, context) =>
        of('mockContext')
      );
      const qualifier = await firstValueFrom(
        service.getQualifier({
          type: 'testType',
          element: 'someElement' as any,
        })
      );
      expect(qualifier).toEqual({ type: 'testType', qualifier: 'mockContext' });
      expect(mockContextService.get).toHaveBeenCalledTimes(1);
      expect(mockContextService.get).toHaveBeenCalledWith(
        'someElement',
        'mockContext'
      );
    });

    it('should return the correct qualifier inferring type', async () => {
      mockContextService.get.mockImplementation((element, context) =>
        of(context === 'entity' ? 'testType' : 'mockContext')
      );
      const qualifier = await firstValueFrom(service.getQualifier({}));
      expect(qualifier).toEqual({ type: 'testType', qualifier: 'mockContext' });
      expect(mockContextService.get).toHaveBeenCalledTimes(2);
      expect(mockContextService.get).toHaveBeenCalledWith(null, 'entity');
      expect(mockContextService.get).toHaveBeenCalledWith(null, 'mockContext');
    });

    it('should throw an error if type is missing and cannot be resolved', async () => {
      mockContextService.get.mockImplementation((element, context) =>
        of(undefined as any)
      );

      await expect(
        firstValueFrom(
          service.getQualifier({ element: 'unknownElement' as any })
        )
      ).rejects.toThrow('No type resolved and no type provided for entity');
    });

    it('should throw an error if context is missing for the qualifier', async () => {
      // Assuming there is no context defined for 'typeWithoutContext'
      await expect(
        firstValueFrom(service.getQualifier({ type: 'typeWithoutContext' }))
      ).rejects.toThrow(
        'No entity provider found for entity typeWithoutContext'
      );
    });
  });
});
