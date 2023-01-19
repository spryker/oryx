import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { DefaultFeatureFlagsService } from './default-feature-flags.service';
import { FeatureFlags, FeatureFlagsService } from './feature-flags.service';

const mockFlags = {
  global: {
    globalProp: 'global',
  },
  'comp-a': {
    a: 'a',
  },
  'comp-b': {
    b: 'b',
  },
};

const mockNewFlags = {
  'comp-g': {
    g: 'g',
  },
};

describe('DefaultFeatureFlagsService', () => {
  let service: FeatureFlagsService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: FeatureFlags,
          useValue: mockFlags,
        },
        {
          provide: FeatureFlags,
          useValue: mockNewFlags,
        },
        {
          provide: FeatureFlagsService,
          useClass: DefaultFeatureFlagsService,
        },
      ],
    });

    service = getInjector().inject(FeatureFlagsService);
  });
  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultFeatureFlagsService);
  });

  describe('getComponentFlags', () => {
    it('should return observable with flags by name from global injector', () => {
      const callback = vi.fn();
      service.getComponentFlags('COMP-A').subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockFlags['comp-a']);
    });

    it('should return observable with flags by name from second flags object parameter', () => {
      const callback = vi.fn();
      const mockAddFlags = {
        'comp-c': {
          c: 'c',
        },
      };
      service
        .getComponentFlags('comp-c', {
          ...mockFlags,
          ...mockAddFlags,
        })
        .subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockAddFlags['comp-c']);
    });
  });

  describe('getFlags', () => {
    it('should return flags object', () => {
      expect(service.getFlags()).toEqual({
        ...mockFlags,
        ...mockNewFlags,
      });
    });
  });
});
