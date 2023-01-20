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

  describe('getFeatureOptions', () => {
    it('should return observable with options by name from injector', () => {
      const callback = vi.fn();
      service.getFeatureOptions('COMP-A').subscribe(callback);
      expect(callback).toHaveBeenCalledWith(mockOptions['comp-a']);
    });
  });

  describe('getOptions', () => {
    it('should return options object', () => {
      const callback = vi.fn();
      service.getOptions().subscribe(callback);
      expect(callback).toHaveBeenCalledWith({
        ...mockOptions,
        ...mockNewOptions,
      });
    });
  });

  describe('addDefaultOptions', () => {
    const mockMergeOptions = {
      'comp-g': {
        g: 'l',
      },
    };

    it('should prepend options', () => {
      const callback = vi.fn();
      service.getOptions().subscribe(callback);
      expect(callback).toHaveBeenNthCalledWith(1, {
        ...mockOptions,
        ...mockNewOptions,
      });
      service.addDefaultOptions(mockMergeOptions);
      expect(callback).toHaveBeenNthCalledWith(2, {
        ...mockMergeOptions,
        ...mockOptions,
        ...mockNewOptions,
      });
    });
  });
});
