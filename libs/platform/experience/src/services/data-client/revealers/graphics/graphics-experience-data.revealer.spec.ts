import { nextFrame } from '@open-wc/testing-helpers';
import { App, AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { ResourcePlugin } from '../../../../plugins';
import { MessageType } from '../../data-client.model';
import { GraphicsExperienceDataRevealer } from './graphics-experience-data.revealer';

const mockAppFn = {
  getGraphics: vi.fn(),
};

const mockApp: Partial<App> = {
  requirePlugin: vi.fn().mockReturnValue(mockAppFn),
};

describe('GraphicsExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: 'service',
          useClass: GraphicsExperienceDataRevealer,
        },
        {
          provide: AppRef,
          useValue: mockApp,
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
    it('should send `MessageType.Graphics` post message', async () => {
      const mockGraphics = {
        a: {},
        b: {},
        c: {},
      };
      mockAppFn.getGraphics.mockReturnValue(mockGraphics);
      getInjector().inject('service').reveal().subscribe();
      await nextFrame();
      expect(mockApp.requirePlugin).toHaveBeenCalledWith(ResourcePlugin);
      expect(mockAppFn.getGraphics).toHaveBeenCalled();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.Graphics,
          data: Object.keys(mockGraphics),
        },
        '*'
      );
    });
  });
});
