import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { firstValueFrom } from 'rxjs';
import { DefaultIncludesService } from './default-includes.service';
import { IncludesService } from './includes-service';
import { provideIncludes } from './provide-includes';

describe('DefaultIncludesService', () => {
  let service: IncludesService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: IncludesService,
          useClass: DefaultIncludesService,
        },
        ...provideIncludes('testResource', ['testInclude']),
        ...provideIncludes('testMultipleResource', [
          'test2Include',
          'test3Include',
        ]),
        ...provideIncludes('testReuseResource', ['newInclude'], 'testResource'),
        ...provideIncludes('testFieldResource', [
          'normalInclude',
          { include: 'fieldInclude', fields: ['field1', 'field2'] },
        ]),
      ],
    });

    service = getInjector().inject(IncludesService);
  });

  afterEach(() => {
    destroyInjector();
    vi.restoreAllMocks();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultIncludesService);
  });

  describe('get', () => {
    it('should return correct include string for a given resource', async () => {
      const resource = 'testResource';
      const expectedResult = 'include=testInclude';

      const result = await firstValueFrom(service.get({ resource }));
      expect(result).toEqual(expectedResult);
    });

    it('should return correct include string for multiple includes', async () => {
      const resource = 'testMultipleResource';
      const expectedResult = 'include=test2Include,test3Include';

      const result = await firstValueFrom(service.get({ resource }));
      expect(result).toEqual(expectedResult);
    });

    it('should handle resource reuse correctly', async () => {
      const resource = 'testReuseResource';
      const expectedResult = 'include=newInclude,testInclude';

      const result = await firstValueFrom(service.get({ resource }));
      expect(result).toEqual(expectedResult);
    });

    it('should return empty string if no configuration is found', async () => {
      const resource = 'unknownResource';
      const result = await firstValueFrom(service.get({ resource }));
      expect(result).toEqual('');
    });

    it('should include additional includes specified in the qualifier and handle duplicates', async () => {
      const resource = 'testMultipleResource';
      const additionalIncludes = [
        'extraInclude1',
        'extraInclude2',
        'test3Include',
      ];
      const expectedResult =
        'include=test2Include,test3Include,extraInclude1,extraInclude2';

      const result = await firstValueFrom(
        service.get({ resource, includes: additionalIncludes })
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle includes with fields correctly', async () => {
      const resource = 'testFieldResource';
      const expectedResult =
        'include=normalInclude,fieldInclude&fields[fieldInclude]=field1,field2';

      const result = await firstValueFrom(service.get({ resource }));
      expect(result).toEqual(expectedResult);
    });
  });
});
