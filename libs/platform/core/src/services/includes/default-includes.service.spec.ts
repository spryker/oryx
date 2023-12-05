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
        ...provideIncludes('testEntity', ['testInclude']),
        ...provideIncludes('testMultipleEntity', [
          'test2Include',
          'test3Include',
        ]),
        ...provideIncludes('testReuseEntity', ['newInclude'], 'testEntity'),
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
    it('should return correct include string for a given entity', async () => {
      const entity = 'testEntity';
      const expectedResult = 'include=testInclude';

      const result = await firstValueFrom(service.get({ entity }));
      expect(result).toEqual(expectedResult);
    });

    it('should return correct include string for multiple includes', async () => {
      const entity = 'testMultipleEntity';
      const expectedResult = 'include=test2Include,test3Include';

      const result = await firstValueFrom(service.get({ entity }));
      expect(result).toEqual(expectedResult);
    });

    it('should handle entity reuse correctly', async () => {
      const entity = 'testReuseEntity';
      const expectedResult = 'include=newInclude,testInclude';

      const result = await firstValueFrom(service.get({ entity }));
      expect(result).toEqual(expectedResult);
    });

    it('should return empty string if no configuration is found', async () => {
      const entity = 'unknownEntity';
      const result = await firstValueFrom(service.get({ entity }));
      expect(result).toEqual('');
    });
  });
});
