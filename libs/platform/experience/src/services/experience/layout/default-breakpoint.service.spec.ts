import { App, AppRef, Theme, ThemePlugin } from '@spryker-oryx/core';
import { Injector } from '@spryker-oryx/di';
import { Size } from '@spryker-oryx/utilities';
import { BreakpointService } from './breakpoint.service';
import { DefaultBreakpointService } from './default-breakpoint.service';

const mockTheme: Theme = {
  name: 'name',
  breakpoints: {
    [Size.Sm]: {
      min: 0,
    },
    [Size.Md]: {
      min: 768,
    },
    [Size.Lg]: {
      min: 1024,
    },
  },
};

class MockApp implements Partial<App> {
  findPlugin = vi.fn().mockReturnValue(new ThemePlugin([mockTheme]));
}

describe('DefaultBreakpointService', () => {
  let service: BreakpointService;

  beforeEach(() => {
    const testInjector = new Injector([
      {
        provide: AppRef,
        useClass: MockApp,
      },
      {
        provide: BreakpointService,
        useClass: DefaultBreakpointService,
      },
    ]);

    service = testInjector.inject(BreakpointService);
  });

  it('should be provided', () => {
    expect(service).toBeInstanceOf(DefaultBreakpointService);
  });

  describe('getSmallest() ', () => {
    it('should return Size.Sm', () => {
      expect(service.getSmallest()).toBe(Size.Sm);
    });
  });

  describe('getMediaQuery() ', () => {
    describe('when breakpoint is Sm', () => {
      it('should return a media query with min 0px', () => {
        const query = service.getMediaQuery(Size.Sm);
        expect(query).toBe('@media (min-width: 0px)');
      });
    });

    describe('when breakpoint is Md', () => {
      it('should return a media query with min 768px', () => {
        const query = service.getMediaQuery(Size.Md);
        expect(query).toBe('@media (min-width: 768px)');
      });
    });

    describe('when breakpoint is Lg', () => {
      it('should return a media query with min 124px', () => {
        const query = service.getMediaQuery(Size.Lg);
        expect(query).toBe('@media (min-width: 1024px)');
      });
    });
  });
});
