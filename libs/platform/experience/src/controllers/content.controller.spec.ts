import { FeatureOptionsService } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import * as litRxjs from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { optionsKey } from '../decorators';
import { ExperienceService } from '../services';
import { ContentController } from './content.controller';

const mockElement = {
  tagName: 'tagName',
} as unknown as LitElement;
const mockUid = 'mockUid';
const mockContent = {
  mockContent: 'mockContent',
};
const mockOptions = {
  mockOptions: 'mockOptions',
};
const mockObserveValue = {
  id: 'mockContent',
};

class MockExperienceService implements Partial<ExperienceService> {
  getContent = vi.fn();
  getOptions = vi.fn();
}

class MockFeatureOptionsService implements Partial<FeatureOptionsService> {
  getFeatureOptions = vi.fn().mockReturnValue({});
}

const mockObserve = {
  get: vi.fn(),
};
vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
(litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
  mockObserve
);

describe('ContentController', () => {
  let mockExperienceService: MockExperienceService;
  let mockFeatureOptionsService: MockFeatureOptionsService;

  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockExperienceService,
        },
        {
          provide: FeatureOptionsService,
          useClass: MockFeatureOptionsService,
        },
      ],
    });

    mockExperienceService = getInjector().inject(
      ExperienceService
    ) as unknown as MockExperienceService;
    mockFeatureOptionsService = getInjector().inject(
      FeatureOptionsService
    ) as unknown as MockFeatureOptionsService;
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('getContent', () => {
    it('should expose content directly if content exist', () => {
      const callback = vi.fn();
      mockObserve.get.mockReturnValue(of(mockObserveValue));
      const contentController = new ContentController(mockElement);
      contentController.getContent().subscribe(callback);

      expect(mockObserve.get).toHaveBeenCalledWith('content');
      expect(callback).toHaveBeenCalledWith(mockObserveValue);
    });

    it('should expose content from service by uid', () => {
      const callback = vi.fn();
      mockObserve.get.mockReturnValueOnce(of(undefined));
      mockObserve.get.mockReturnValue(of(mockUid));
      mockExperienceService.getContent.mockReturnValue(of(mockContent));
      const contentController = new ContentController(mockElement);
      contentController.getContent().subscribe(callback);

      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'content');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getContent).toHaveBeenCalledWith({
        uid: mockUid,
      });
      expect(callback).toHaveBeenCalledWith(mockContent);
    });

    it('should emit `undefined` if content, uid and ExperienceService are not defined', () => {
      const callback = vi.fn();
      mockObserve.get.mockReturnValue(of(undefined));
      const contentController = new ContentController(mockElement);
      contentController.getContent().subscribe(callback);

      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'content');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getContent).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getOptions', () => {
    it('should expose options directly if options exist', () => {
      const callback = vi.fn();
      mockObserve.get.mockReturnValue(of(mockObserveValue));
      const contentController = new ContentController(mockElement);
      contentController.getOptions().subscribe(callback);

      expect(mockFeatureOptionsService.getFeatureOptions).toHaveBeenCalledWith(
        mockElement.tagName
      );
      expect(mockObserve.get).toHaveBeenCalledWith('options');
      expect(callback).toHaveBeenCalledWith(mockObserveValue);
    });

    it('should expose options from service by uid', () => {
      const callback = vi.fn();
      mockObserve.get.mockReturnValueOnce(of(undefined));
      mockObserve.get.mockReturnValue(of(mockUid));
      mockExperienceService.getOptions.mockReturnValue(of(mockOptions));
      const contentController = new ContentController(mockElement);
      contentController.getOptions().subscribe(callback);

      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'options');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getOptions).toHaveBeenCalledWith({
        uid: mockUid,
      });
      expect(callback).toHaveBeenCalledWith(mockOptions);
    });

    it('should emit `empty object` if options, uid and ExperienceService are not defined', () => {
      const callback = vi.fn();
      mockObserve.get.mockReturnValue(of(undefined));
      const contentController = new ContentController(mockElement);
      contentController.getOptions().subscribe(callback);

      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'options');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getOptions).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith({});
    });

    describe('when default options has been passed', () => {
      const mockDefaultValue = {
        a: 'a',
        b: 'b',
      };
      const mockPrototype = {
        ...mockElement,
        constructor: {
          __proto__: {
            [optionsKey]: mockDefaultValue,
          },
        },
      } as unknown as LitElement;

      it('should expose options directly if options exist', () => {
        const callback = vi.fn();
        mockObserve.get.mockReturnValue(of(mockObserveValue));
        const contentController = new ContentController(mockPrototype);
        contentController.getOptions().subscribe(callback);

        expect(callback).toHaveBeenCalledWith({
          ...mockDefaultValue,
          ...mockObserveValue,
        });
      });

      it('should expose options from service by uid', () => {
        const callback = vi.fn();
        mockObserve.get.mockReturnValueOnce(of(undefined));
        mockObserve.get.mockReturnValue(of(mockUid));
        mockExperienceService.getOptions.mockReturnValue(of(mockOptions));
        const contentController = new ContentController(mockPrototype);
        contentController.getOptions().subscribe(callback);

        expect(callback).toHaveBeenCalledWith({
          ...mockDefaultValue,
          ...mockOptions,
        });
      });

      it('should emit default options if options, uid and ExperienceService are not defined', () => {
        const callback = vi.fn();
        mockObserve.get.mockReturnValue(of(undefined));
        const contentController = new ContentController(mockPrototype);
        contentController.getOptions().subscribe(callback);

        expect(callback).toHaveBeenCalledWith(mockDefaultValue);
      });

      describe('when feature options has been passed', () => {
        it('should merge options and emit', () => {
          const mocFeatureOptions = {
            c: 'c',
          };
          mockFeatureOptionsService.getFeatureOptions.mockReturnValue(
            mocFeatureOptions
          );
          const callback = vi.fn();
          mockObserve.get.mockReturnValue(of(mockObserveValue));
          const contentController = new ContentController(mockPrototype);
          contentController.getOptions().subscribe(callback);

          expect(callback).toHaveBeenCalledWith({
            ...mockDefaultValue,
            ...mocFeatureOptions,
            ...mockObserveValue,
          });
        });
      });
    });
  });
});
