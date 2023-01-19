import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { DefaultFeatureOptionsService } from './default-feature-options.service';
import {
  FeatureOptions,
  FeatureOptionsService,
  OptionsMergeStrategies,
} from './feature-options.service';

const mockOptions = {
  'comp-a': {
    a: 'a',
  },
  'comp-b': {
    b: 'b',
  },
};

const mockNewOptions = {
  'comp-g': {
    g: 'g',
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
          provide: FeatureOptions,
          useValue: mockNewOptions,
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

  describe('getComponentOptions', () => {
    it('should return observable with options by name from injector', () => {
      const callback = vi.fn();
      service.getComponentOptions('COMP-A').subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockOptions['comp-a']);
    });
  });

  describe('getOptions', () => {
    it('should return options object', () => {
      expect(service.getOptions()).toEqual({
        ...mockOptions,
        ...mockNewOptions,
      });
    });
  });

  describe('mergeOptions', () => {
    const mockMergeOptions = {
      'comp-g': {
        g: 'l',
      },
    };

    it('should prepend options by default', () => {
      expect(service.getOptions()).toEqual({
        ...mockOptions,
        ...mockNewOptions,
      });
      service.mergeOptions(mockMergeOptions);
      expect(service.getOptions()).toEqual({
        ...mockMergeOptions,
        ...mockOptions,
        ...mockNewOptions,
      });
    });

    it('should append options with OptionsMergeStrategies.Append strategy', () => {
      expect(service.getOptions()).toEqual({
        ...mockOptions,
        ...mockNewOptions,
      });
      service.mergeOptions(mockMergeOptions, OptionsMergeStrategies.Append);
      expect(service.getOptions()).toEqual({
        ...mockOptions,
        ...mockNewOptions,
        ...mockMergeOptions,
      });
    });
  });
});
