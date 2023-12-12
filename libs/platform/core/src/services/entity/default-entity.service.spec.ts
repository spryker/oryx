import { provideEntity } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { firstValueFrom, of } from 'rxjs';
import { ContextService } from '../context';
import { DefaultEntityService } from './default-entity.service';
import { EntityService } from './entity.service';

const mockTestService = {
  get: vi.fn((qualifier) => of({ result: 'data' } as any)),
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
      expect(data).toEqual({ result: 'data' });
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
      const mockEntity = {
        nested: {
          field: 'nestedValue'
        }
      };
      mockTestService.get.mockReturnValue(of(mockEntity));

      // Test getField for a nested field
      const data = await firstValueFrom(service.getField({ type: 'testType', field: 'nested.field' }));
      expect(data).toBe('nestedValue');
    });

  });

});
