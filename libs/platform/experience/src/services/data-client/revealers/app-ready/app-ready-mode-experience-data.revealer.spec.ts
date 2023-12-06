import { nextFrame } from '@open-wc/testing-helpers';
import { AppRef } from '@spryker-oryx/core';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { MessageType } from '../../data-client.model';
import { AppReadyExperienceDataRevealer } from './app-ready-mode-experience-data.revealer';

const mockApp = {
  whenReady: vi.fn(),
};

describe('AppReadyExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: 'service',
          useClass: AppReadyExperienceDataRevealer,
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
    it('should send `MessageType.AppReady` post message', async () => {
      mockApp.whenReady.mockReturnValue(Promise.resolve(null));
      getInjector().inject('service').reveal().subscribe();
      await nextFrame();
      expect(mockApp.whenReady).toHaveBeenCalled();
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          type: MessageType.AppReady,
          data: null,
        },
        '*'
      );
    });
  });
});
