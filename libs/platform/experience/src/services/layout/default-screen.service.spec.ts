import { App, AppRef } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import { Theme, ThemePlugin } from '../../plugins';
import { DefaultScreenService } from './default-screen.service';
import { ScreenService } from './screen.service';

const mockTheme: Theme = {
  name: 'name',
  breakpoints: {
    [Size.Sm]: {
      max: 767,
    },
    [Size.Md]: {
      min: 768,
      max: 1023,
    },
    [Size.Lg]: {
      min: 1024,
    },
  },
};

class MockApp implements Partial<App> {
  requirePlugin = vi.fn().mockReturnValue(new ThemePlugin([mockTheme]));
}

describe('DefaultScreenService', () => {
  let service: ScreenService;

  beforeEach(() => {
    const testInjector = new Injector([
      {
        provide: AppRef,
        useClass: MockApp,
      },
      {
        provide: ScreenService,
        useClass: DefaultScreenService,
      },
    ]);

    service = testInjector.inject(ScreenService);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultScreenService);
  });

  describe('getSmallest() ', () => {
    it('should return Size.Sm', () => {
      expect(service.getSmallest()).toBe(Size.Sm);
    });
  });

  describe('getScreenMedia() ', () => {
    describe('when breakpoint is Md', () => {
      it('should return a media query with min 768px and max 1023px', () => {
        const query = service.getScreenMedia(Size.Md);
        expect(query).toBe('@media (min-width: 768px) and (max-width: 1023px)');
      });
    });

    describe('when breakpoint is Lg', () => {
      it('should return a media query with min 124px', () => {
        const query = service.getScreenMedia(Size.Lg);
        expect(query).toBe('@media (min-width: 1024px)');
      });
    });
  });

  describe('getBreakpoint', () => {
    describe('when screen size corresponds to large screens', () => {
      const callback = vi.fn();

      beforeEach(() => {
        service.getScreenSize().subscribe(callback);
      });

      it('should set lg breakpoint', () => {
        expect(callback).toHaveBeenCalledWith(Size.Lg);
      });
    });
  });
});
