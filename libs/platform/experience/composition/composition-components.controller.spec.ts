import { TokenResolver } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import {
  Component,
  ExperienceService,
  ScreenService,
} from '@spryker-oryx/experience';
import * as utils from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { SpyInstance, describe } from 'vitest';
import { CompositionComponentsController } from './composition-components.controller';

const mockElement = {
  tagName: 'tagName',
} as unknown as LitElement;

const mockUid = 'mockUid';
const rules = ['mockRule1', 'mockRule2'];

const hideByRule = 'mockRule';
const hideByOrConditionalRule = rules.join('||');

const mockComponent: Component = {
  id: 'mockId',
  type: 'mockType',
};

const mockComponentWithComposition: Component = {
  ...mockComponent,
  components: [mockComponent],
};

const mockComponentWithVisibility: Component = {
  ...mockComponent,
  components: [
    {
      ...mockComponent,
      options: {
        rules: [
          {
            hide: false,
          },
        ],
      },
    },
  ],
};

const mockComponentWithVisibilityHidden: Component = {
  ...mockComponent,
  components: [
    {
      ...mockComponent,
      options: {
        rules: [
          {
            hide: true,
          },
        ],
      },
    },
  ],
};

const mockComponentWithVisibilityRule: Component = {
  ...mockComponent,
  components: [
    {
      ...mockComponent,
      options: {
        rules: [
          {
            hideByRule,
          },
        ],
      },
    },
  ],
};

const mockComponentWithBreakpointMd: Component = {
  ...mockComponent,
  components: [
    {
      ...mockComponent,
      options: {
        rules: [
          {
            query: { breakpoint: utils.Size.Md },
            hide: true,
          },
        ],
      },
    },
  ],
};

const mockComponentWithBreakpointLg: Component = {
  ...mockComponent,
  components: [
    {
      ...mockComponent,
      options: {
        rules: [
          {
            query: { breakpoint: utils.Size.Lg },
            hide: true,
          },
        ],
      },
    },
  ],
};

class MockScreenService implements Partial<ScreenService> {
  getScreenSize = vi.fn().mockReturnValue(of('lg'));
}

class MockExperienceService implements Partial<ExperienceService> {
  getComponent = vi.fn().mockReturnValue(of({}));
}

const mockObserve = {
  get: vi.fn().mockReturnValue(of(null)),
};
vi.spyOn(utils, 'ObserveController') as SpyInstance;
(utils.ObserveController as unknown as SpyInstance).mockReturnValue(
  mockObserve
);

class MockTokenResolver implements Partial<TokenResolver> {
  resolveToken = vi.fn().mockReturnValue(of(false));
}

describe('CompositionComponentsController', () => {
  let experienceService: MockExperienceService;
  let tokenResolver: MockTokenResolver;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: ScreenService,
          useClass: MockScreenService,
        },
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
        {
          provide: TokenResolver,
          useClass: MockTokenResolver,
        },
      ],
    });

    experienceService =
      getInjector().inject<MockExperienceService>(ExperienceService);
    tokenResolver = getInjector().inject<MockTokenResolver>(TokenResolver);
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('hasDynamicallyVisibleComponent', () => {
    describe('when uid is not provided', () => {
      const callback = vi.fn();
      beforeEach(() => {
        const controller = new CompositionComponentsController(mockElement);
        controller.hasDynamicallyVisibleComponent().subscribe(callback);
      });

      it('should return false', () => {
        expect(callback).toBeCalledWith(false);
      });
    });

    describe('when component has no composition components', () => {
      const callback = vi.fn();
      beforeEach(() => {
        mockObserve.get = vi.fn().mockReturnValue(of(mockUid));
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponent));
        const controller = new CompositionComponentsController(mockElement);
        controller.hasDynamicallyVisibleComponent().subscribe(callback);
      });

      it('should return false', () => {
        expect(callback).toBeCalledWith(false);
      });
    });

    describe('when component has composition components without visibility config', () => {
      const callback = vi.fn();
      beforeEach(() => {
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponentWithComposition));
        const controller = new CompositionComponentsController(mockElement);
        controller.hasDynamicallyVisibleComponent().subscribe(callback);
      });

      it('should return false', () => {
        expect(callback).toBeCalledWith(false);
      });
    });

    describe('when component has hidden composition components', () => {
      const callback = vi.fn();
      beforeEach(() => {
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponentWithVisibilityHidden));
        const controller = new CompositionComponentsController(mockElement);
        controller.hasDynamicallyVisibleComponent().subscribe(callback);
      });

      it('should return true', () => {
        expect(callback).toBeCalledWith(true);
      });
    });

    describe('when component has composition components with visibility rules', () => {
      const callback = vi.fn();
      beforeEach(() => {
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponentWithVisibilityRule));
        const controller = new CompositionComponentsController(mockElement);
        controller.hasDynamicallyVisibleComponent().subscribe(callback);
      });

      it('should return true', () => {
        expect(callback).toBeCalledWith(true);
      });
    });
  });

  describe('getComponents', () => {
    describe('when component has no composition components', () => {
      const callback = vi.fn();
      beforeEach(() => {
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponent));
        const controller = new CompositionComponentsController(mockElement);
        controller.getComponents().subscribe(callback);
      });

      it('should return empty array', () => {
        expect(callback).toBeCalledWith([]);
      });
    });

    describe('when the composition has a components in the main and bucket', () => {
      const callback = vi.fn();

      const mockBucketComponent = { id: 'mockBucket', type: 'mockBucket' };

      const mockComponentWithBucket: Component = {
        ...mockComponent,
        components: {
          main: [mockComponent],
          bucket: [mockBucketComponent],
        },
      };

      beforeEach(() => {
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponentWithBucket));
      });

      describe('and a bucket property is not provided', () => {
        beforeEach(() => {
          const controller = new CompositionComponentsController(mockElement);
          controller.getComponents().subscribe(callback);
        });

        it('should return the mock component', () => {
          expect(callback).toBeCalledWith([mockComponent]);
        });
      });

      describe('and a bucket property is provided', () => {
        beforeEach(() => {
          const mockElementWithBucket = {
            tagName: 'tagName',
            bucket: 'bucket',
          } as unknown as LitElement;
          const controller = new CompositionComponentsController(
            mockElementWithBucket
          );
          controller.getComponents().subscribe(callback);
        });

        it('should return the mock component', () => {
          expect(callback).toBeCalledWith([mockBucketComponent]);
        });
      });
    });

    describe('when component has composition components without visibility config', () => {
      const callback = vi.fn();
      beforeEach(() => {
        mockObserve.get = vi.fn().mockReturnValue(of(mockUid));
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponentWithComposition));
        const controller = new CompositionComponentsController(mockElement);
        controller.getComponents().subscribe(callback);
      });

      it('should not filter the components', () => {
        expect(callback).toBeCalledWith(
          mockComponentWithComposition.components
        );
      });
    });

    describe('when component has composition components that are not hidden', () => {
      const callback = vi.fn();
      beforeEach(() => {
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponentWithVisibility));
        const controller = new CompositionComponentsController(mockElement);
        controller.getComponents().subscribe(callback);
      });

      it('should not filter the components', () => {
        expect(callback).toBeCalledWith(mockComponentWithVisibility.components);
      });
    });

    describe('when component has hidden composition components', () => {
      const callback = vi.fn();
      beforeEach(() => {
        experienceService.getComponent = vi
          .fn()
          .mockReturnValue(of(mockComponentWithVisibilityHidden));
        const controller = new CompositionComponentsController(mockElement);
        controller.getComponents().subscribe(callback);
      });

      it('should filter the components', () => {
        expect(callback).toBeCalledWith([]);
      });
    });

    describe('when rules contain breakpoints', () => {
      describe('and rule`s breakpoint does not match actual one', () => {
        const callback = vi.fn();
        beforeEach(() => {
          experienceService.getComponent = vi
            .fn()
            .mockReturnValue(of(mockComponentWithBreakpointMd));
          const controller = new CompositionComponentsController(mockElement);
          controller.getComponents().subscribe(callback);
        });

        it('should not filter the components', () => {
          expect(callback).toBeCalledWith(
            mockComponentWithBreakpointMd.components
          );
        });
      });

      describe('and rule`s breakpoint matches actual one', () => {
        const callback = vi.fn();
        beforeEach(() => {
          experienceService.getComponent = vi
            .fn()
            .mockReturnValue(of(mockComponentWithBreakpointLg));
          const controller = new CompositionComponentsController(mockElement);
          controller.getComponents().subscribe(callback);
        });

        it('should filter the components', () => {
          expect(callback).toBeCalledWith([]);
        });
      });
    });

    describe('when component has composition components with dynamic visibility rule', () => {
      describe('and rule is resolved with false', () => {
        const callback = vi.fn();
        beforeEach(() => {
          experienceService.getComponent = vi
            .fn()
            .mockReturnValue(of(mockComponentWithVisibilityRule));
          const controller = new CompositionComponentsController(mockElement);
          controller.getComponents().subscribe(callback);
        });

        it('should resolve the token with options', () => {
          expect(tokenResolver.resolveToken).toBeCalledWith({
            token: hideByRule,
            contextElement: mockElement,
          });
        });

        it('should not filter the components', () => {
          expect(callback).toBeCalledWith(
            mockComponentWithVisibilityRule.components
          );
        });
      });

      describe('and rule is resolved with true', () => {
        const callback = vi.fn();
        beforeEach(() => {
          tokenResolver.resolveToken = vi.fn().mockReturnValue(of(true));
          experienceService.getComponent = vi
            .fn()
            .mockReturnValue(of(mockComponentWithVisibilityRule));
          const controller = new CompositionComponentsController(mockElement);
          controller.getComponents().subscribe(callback);
        });

        it('should resolve the token with options', () => {
          expect(tokenResolver.resolveToken).toBeCalledWith({
            token: hideByRule,
            contextElement: mockElement,
          });
        });

        it('should filter the components', () => {
          expect(callback).toBeCalledWith([]);
        });
      });
    });

    describe('when composition has refs', () => {
      const callback = vi.fn();
      const mocks = {
        mockRefA: { id: 'mockRefA', type: 'mockRefA' },
        mockRefB: { id: 'mockRefB', type: 'mockRefB' },
        mockId: {
          id: 'mockId',
          type: 'mockType',
          components: [
            { ref: 'mockRefA' },
            { id: 'mockId1', type: 'mockType1' },
            { ref: 'mockRefB' },
          ],
        },
      };

      beforeEach(() => {
        mockObserve.get = vi.fn().mockReturnValue(of(mocks.mockId.id));
        experienceService.getComponent.mockImplementation(
          (data: { uid: keyof typeof mocks }) => of(mocks[data.uid])
        );
      });

      it('should properly resolve refs', () => {
        const controller = new CompositionComponentsController(mockElement);
        controller.getComponents().subscribe(callback);
        expect(callback).toHaveBeenCalledWith([
          mocks.mockRefA,
          mocks.mockId.components[1],
          mocks.mockRefB,
        ]);
      });
    });
  });
});
