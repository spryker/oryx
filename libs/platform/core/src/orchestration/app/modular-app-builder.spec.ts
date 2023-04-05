import { FeatureOptions } from '../../services/feature-options';
import { ComponentsInfo, ComponentsPlugin } from '../components';
import { InjectionPlugin } from '../injection';
import { Theme, ThemePlugin } from '../theme';
import { ModularAppBuilder } from './modular-app-builder';

const mockApply = vi.fn();

vi.mock('../components', () => ({
  ComponentsPlugin: vi.fn().mockReturnValue({
    apply: () => mockApply(),
  }),
}));

vi.mock('../theme', () => ({
  ThemePlugin: vi.fn().mockReturnValue({
    apply: () => mockApply(),
  }),
}));

vi.mock('../injection', () => ({
  InjectionPlugin: vi.fn().mockReturnValue({
    apply: () => mockApply(),
  }),
}));

const mockOptions = {
  injector: {
    context: 'context',
  },
  components: {
    preload: true,
  },
};

describe('ModularAppBuilder', () => {
  let modularAppBuilder: ModularAppBuilder;

  beforeEach(() => {
    modularAppBuilder = new ModularAppBuilder();
    vi.clearAllMocks();
  });

  describe('withAppOptions', () => {
    it('should return instance of itself', () => {
      expect(modularAppBuilder.withAppOptions(mockOptions)).toBe(
        modularAppBuilder
      );
    });
  });

  describe('withProviders', () => {
    const mockProviders = [{ provide: 'provide', useValue: 'useValue' }];

    it('should return instance of itself', () => {
      expect(modularAppBuilder.withProviders(mockProviders)).toBe(
        modularAppBuilder
      );
    });

    it('should add providers and pass them to the InjectionPlugin with options', async () => {
      await modularAppBuilder
        .withProviders(mockProviders)
        .withAppOptions(mockOptions)
        .create();
      expect(InjectionPlugin).toHaveBeenCalledWith(
        mockProviders,
        mockOptions.injector
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });

  describe('withComponents', () => {
    const mockComponents = ['mockComponents'] as unknown as ComponentsInfo;

    it('should return instance of itself', () => {
      expect(modularAppBuilder.withComponents(mockComponents)).toBe(
        modularAppBuilder
      );
    });

    it('should add components and pass them to the ComponentsPlugin with options', async () => {
      await modularAppBuilder
        .withComponents(mockComponents)
        .withAppOptions(mockOptions)
        .create();
      expect(ComponentsPlugin).toHaveBeenCalledWith(
        mockComponents,
        mockOptions.components
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });

  describe('withFeature', () => {
    const mockComponents = ['mockComponents'] as unknown as ComponentsInfo;
    const mockProviders = [{ provide: 'provide', useValue: 'useValue' }];

    it('should return instance of itself', () => {
      expect(
        modularAppBuilder.withFeature({
          providers: mockProviders,
          components: mockComponents,
        })
      ).toBe(modularAppBuilder);
    });

    it('should pass components and injectors into appropriate plugins with options', async () => {
      await modularAppBuilder
        .withFeature({
          providers: mockProviders,
          components: mockComponents,
        })
        .withAppOptions(mockOptions)
        .create();
      expect(ComponentsPlugin).toHaveBeenCalledWith(
        mockComponents,
        mockOptions.components
      );
      expect(InjectionPlugin).toHaveBeenCalledWith(
        mockProviders,
        mockOptions.injector
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });

  describe('withTheme', () => {
    const mockTheme = {
      a: {
        styles: 'a',
      },
    } as unknown as Theme;

    it('should return instance of itself', () => {
      expect(modularAppBuilder.withTheme(mockTheme)).toBe(modularAppBuilder);
      expect(modularAppBuilder.withTheme([mockTheme])).toBe(modularAppBuilder);
    });

    it('should add themes and pass them to the ThemePlugin', async () => {
      await modularAppBuilder.withTheme(mockTheme).create();
      expect(ThemePlugin).toHaveBeenCalledWith([mockTheme]);
    });
  });

  describe('withOptions', () => {
    const mockOptions: FeatureOptions = {
      global: {
        test: 'test',
      },
      a: {
        a: 'a',
      },
      b: {
        b: 'b',
      },
    };

    it('should return instance of itself', () => {
      expect(modularAppBuilder.withOptions(mockOptions)).toBe(
        modularAppBuilder
      );
    });

    it('should add `FeatureOptions` to provider', async () => {
      await modularAppBuilder.withOptions(mockOptions).create();
      expect(InjectionPlugin).toHaveBeenCalledWith(
        [{ provide: FeatureOptions, useValue: mockOptions }],
        undefined
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });
});
