import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { DefaultFeatureOptionsService } from './default-feature-options.service';
import {
  FeatureOptions,
  FeatureOptionsService,
} from './feature-options.service';

const mockOptions = {
  'comp-a': {
    a: 'a',
  },
  'comp-b': {
    b: 'b',
  },
};

describe('DefaultFeatureOptionsService', () => {
  let service: FeatureOptionsService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: FeatureOptions,
          useValue: mockOptions,
        },
        {
          provide: FeatureOptionsService,
          useClass: DefaultFeatureOptionsService,
        },
      ],
    });

    service = getInjector().inject(FeatureOptionsService);
  });
  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultFeatureOptionsService);
  });

  describe('getFeatureOptions', () => {
    it('should return options list by name from injector', () => {
      expect(service.getFeatureOptions('COMP-A')).toEqual(
        mockOptions['comp-a']
      );
    });
  });
});
