import { nextFrame } from '@open-wc/testing-helpers';
import { App, AppRef, FeatureOptionsService } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { ComponentsPlugin } from '@spryker-oryx/utilities';
import { optionsKey } from '../../../decorators';
import { MessageType } from '../data-client.model';
import { postMessage } from '../utilities';
import { OptionsExperienceDataRevealer } from './options-experience-data.revealer';

const mockAppFn = {
  getGraphics: vi.fn(),
  getComponentClass: vi.fn(),
};

const mockApp: Partial<App> = {
  requirePlugin: vi.fn().mockReturnValue(mockAppFn),
};

const mockFeatureOptionsService = {
  getFeatureOptions: vi.fn().mockReturnValue(null),
};

describe('OptionsExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: 'service',
          useClass: OptionsExperienceDataRevealer,
        },
        {
          provide: AppRef,
          useValue: mockApp,
        },
        {
          provide: FeatureOptionsService,
          useValue: mockFeatureOptionsService,
        },
      ],
    });
    vi.spyOn(window.parent, 'postMessage');
  });

  afterEach(() => {
    destroyInjector();
    vi.clearAllMocks();
  });

  describe('reveal', () => {
    it('should send `MessageType.Options` post message', async () => {
      const mockDefaultOptions = {
        b: 'b',
      };
      const mockFeatureOptions = {
        c: 'c',
      };
      const mockComponentType = 'mockComponentType';
      mockAppFn.getComponentClass.mockReturnValue({
        [optionsKey]: mockDefaultOptions,
      });
      mockFeatureOptionsService.getFeatureOptions.mockReturnValue(
        mockFeatureOptions
      );
      getInjector().inject('service').reveal().subscribe();
      postMessage(
        {
          type: MessageType.ComponentType,
          data: mockComponentType,
        },
        window
      );
      await nextFrame();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Options,
          data: {
            ...mockDefaultOptions,
            ...mockFeatureOptions,
          },
        },
        '*'
      );
      expect(mockAppFn.getComponentClass).toHaveBeenCalledWith(
        mockComponentType
      );
      expect(mockApp.requirePlugin).toHaveBeenCalledWith(ComponentsPlugin);
    });
  });
});
