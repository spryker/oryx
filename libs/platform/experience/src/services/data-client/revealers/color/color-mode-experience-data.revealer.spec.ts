import { nextFrame } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector, getInjector } from '@spryker-oryx/di';
import { EVENT_TOGGLE_COLOR } from '@spryker-oryx/ui/color-mode-selector';
import { MessageType } from '../../data-client.model';
import { postMessage } from '../../utilities';
import { ColorModeExperienceDataRevealer } from './color-mode-experience-data.revealer';

describe('ColorModeExperienceDataRevealer', () => {
  beforeEach(() => {
    createInjector({
      providers: [
        {
          provide: 'service',
          useClass: ColorModeExperienceDataRevealer,
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
    it('should dispatch EVENT_TOGGLE_COLOR', async () => {
      const callback = vi.fn();
      const mockMode = {
        old: 'old',
        mode: 'new',
      };
      window.addEventListener(EVENT_TOGGLE_COLOR, (d) =>
        callback((d as CustomEvent).detail)
      );
      getInjector().inject('service').reveal().subscribe();
      postMessage(
        {
          type: MessageType.ColorMode,
          data: mockMode,
        },
        window
      );
      await nextFrame();
      expect(callback).toHaveBeenCalledWith(mockMode);
    });
  });
});
