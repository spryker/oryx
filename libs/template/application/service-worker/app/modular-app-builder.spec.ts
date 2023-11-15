import { InjectionPlugin } from '@spryker-oryx/core';
import { ModularAppBuilder } from './modular-app-builder';

const mockApply = vi.fn();

vi.mock('@spryker-oryx/core', async () => {
  const actual = (await vi.importActual('@spryker-oryx/core')) as Record<
    string,
    unknown
  >;

  return {
    ...actual,
    InjectionPlugin: vi.fn().mockReturnValue({
      apply: () => mockApply(),
    }),
  };
});

vi.mock('@spryker-oryx/utilities', async () => {
  const actual = (await vi.importActual('@spryker-oryx/utilities')) as Record<
    string,
    unknown
  >;

  return {
    ...actual,
    ComponentsPlugin: vi.fn().mockReturnValue({
      apply: () => mockApply(),
    }),
  };
});

const mockOptions = {
  injector: {
    context: 'context',
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

  describe('withFeature', () => {
    const mockProviders = [{ provide: 'provide', useValue: 'useValue' }];

    it('should return instance of itself', () => {
      expect(
        modularAppBuilder.withFeature({
          providers: mockProviders,
        })
      ).toBe(modularAppBuilder);
    });

    it('should pass components and injectors into appropriate plugins with options', async () => {
      await modularAppBuilder
        .withFeature({
          providers: mockProviders,
        })
        .withAppOptions(mockOptions)
        .create();
      expect(InjectionPlugin).toHaveBeenCalledWith(
        mockProviders,
        mockOptions.injector
      );
      expect(mockApply).toHaveBeenCalled();
    });
  });
});
