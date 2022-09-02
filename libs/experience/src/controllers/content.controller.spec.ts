import * as injector from '@spryker-oryx/injector';
import { resolve } from '@spryker-oryx/injector';
import * as litRxjs from '@spryker-oryx/lit-rxjs';
import { LitElement } from 'lit';
import { of } from 'rxjs';
import { SpyInstance } from 'vitest';
import { ExperienceService } from '../services';
import { ContentController } from './content.controller';

const mockElement = {} as unknown as LitElement;
const mockUid = 'mockUid';
const mockContent = {
  data: 'mockContent',
};
const mockOptions = {
  data: 'mockContent',
};
const mockObserveValue = {
  id: 'mockContent',
};

const callbackContent = vi.fn();
const callbackOptions = vi.fn();
const mockExperienceService = {
  getContent: vi.fn(),
  getOptions: vi.fn(),
};
vi.spyOn(injector, 'resolve') as SpyInstance;
(injector.resolve as unknown as SpyInstance).mockReturnValue(
  mockExperienceService
);

const mockObserve = {
  get: vi.fn(),
};
vi.spyOn(litRxjs, 'ObserveController') as SpyInstance;
(litRxjs.ObserveController as unknown as SpyInstance).mockReturnValue(
  mockObserve
);

describe('ContentController', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getContent', () => {
    it('should expose content directly if content exist', () => {
      mockObserve.get.mockReturnValue(of(mockObserveValue));
      const contentController = new ContentController(mockElement);
      contentController.getContent().subscribe(callbackContent);

      expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
      expect(mockObserve.get).toHaveBeenCalledWith('content');
      expect(callbackContent).toHaveBeenCalledWith(mockObserveValue);
    });

    it('should expose content from service by uid', () => {
      mockObserve.get.mockReturnValueOnce(of(undefined));
      mockObserve.get.mockReturnValue(of(mockUid));
      mockExperienceService.getContent.mockReturnValue(of(mockContent));
      const contentController = new ContentController(mockElement);
      contentController.getContent().subscribe(callbackContent);

      expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'content');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getContent).toHaveBeenCalledWith({
        uid: mockUid,
      });
      expect(callbackContent).toHaveBeenCalledWith(mockContent.data);
    });

    it('should emit `undefined` if content, uid and ExperienceService are not defined', () => {
      mockObserve.get.mockReturnValue(of(undefined));
      const contentController = new ContentController(mockElement);
      contentController.getContent().subscribe(callbackContent);

      expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'content');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getContent).not.toHaveBeenCalled();
      expect(callbackContent).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getOptions', () => {
    it('should expose options directly if options exist', () => {
      mockObserve.get.mockReturnValue(of(mockObserveValue));
      const contentController = new ContentController(mockElement);
      contentController.getOptions().subscribe(callbackOptions);

      expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
      expect(mockObserve.get).toHaveBeenCalledWith('options');
      expect(callbackOptions).toHaveBeenCalledWith(mockObserveValue);
    });

    it('should expose options from service by uid', () => {
      mockObserve.get.mockReturnValueOnce(of(undefined));
      mockObserve.get.mockReturnValue(of(mockUid));
      mockExperienceService.getOptions.mockReturnValue(of(mockOptions));
      const contentController = new ContentController(mockElement);
      contentController.getOptions().subscribe(callbackOptions);

      expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'options');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getOptions).toHaveBeenCalledWith({
        uid: mockUid,
      });
      expect(callbackOptions).toHaveBeenCalledWith(mockOptions.data);
    });

    it('should emit `empty object` if options, uid and ExperienceService are not defined', () => {
      mockObserve.get.mockReturnValue(of(undefined));
      const contentController = new ContentController(mockElement);
      contentController.getOptions().subscribe(callbackOptions);

      expect(resolve).toHaveBeenCalledWith(ExperienceService, null);
      expect(mockObserve.get).toHaveBeenNthCalledWith(1, 'options');
      expect(mockObserve.get).toHaveBeenNthCalledWith(2, 'uid');
      expect(mockExperienceService.getOptions).not.toHaveBeenCalled();
      expect(callbackOptions).toHaveBeenCalledWith({});
    });
  });
});
