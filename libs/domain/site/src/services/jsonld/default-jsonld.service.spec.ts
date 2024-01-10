import { ContextService, EntityService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { of } from 'rxjs';
import { DefaultJsonLdService } from './default-jsonld.service';
import { JsonLdNormalizer, jsonLdTokenFactory } from './jsonld.normalizer';
import { JsonLdService } from './jsonld.service';

class MockContextService implements Partial<ContextService> {
  get = vi.fn().mockReturnValue(of());
}
const mockEntityWithNormalizers = 'mockEntityWithNormalizers';
const mockEntityWithoutNormalizers = 'mockEntityWithoutNormalizers';

class MockEntityService implements Partial<EntityService> {
  get = vi.fn().mockReturnValue(of());
}

class MockJsonLdNormalizer implements Partial<JsonLdNormalizer> {
  normalize = vi.fn();
}

describe('DefaultJsonLdService', () => {
  let service: JsonLdService;
  let entityService: MockEntityService;
  let jsonLdNormalizer: MockJsonLdNormalizer;

  beforeEach(() => {
    const token = jsonLdTokenFactory(
      mockEntityWithNormalizers,
      'mockNormalizer'
    );
    const testInjector = createInjector({
      providers: [
        {
          provide: JsonLdService,
          useClass: DefaultJsonLdService,
        },
        {
          provide: ContextService,
          useClass: MockContextService,
        },
        {
          provide: EntityService,
          useClass: MockEntityService,
        },
        {
          provide: token,
          useClass: MockJsonLdNormalizer,
        },
      ],
    });

    service = testInjector.inject(JsonLdService);
    entityService = testInjector.inject<MockEntityService>(EntityService);
    jsonLdNormalizer = testInjector.inject<MockJsonLdNormalizer>(token);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultJsonLdService);
  });

  //   describe('when an entity is available', () => {
  //     beforeEach(() => {
  //       entityService.get.mockReturnValue(of(mockEntityWithNormalizers));
  //       service.getSchemas();
  //     });

  //     describe('and there are normalizers available for the entity', () => {
  //       it('should normalize the value', () => {
  //         expect(jsonLdNormalizer.normalize).toHaveBeenCalled();
  //       });
  //     });
  //   });
});
