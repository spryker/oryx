import { Injector } from '@spryker-oryx/injector';
import { BreakpointService } from './breakpoint.service';
import { Breakpoint } from './constants';
import { DefaultBreakpointService } from './default-breakpoint.service';

describe('DefaultBreakpointService', () => {
  let service: BreakpointService;

  beforeEach(() => {
    const testInjector = new Injector([
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
    it('should return Breakpoint.Xs', () => {
      expect(service.getSmallest()).toBe(Breakpoint.Xs);
    });
  });

  describe('getMediaQuery() ', () => {
    describe('when breakpoint is the smallest', () => {
      it('should not return a media query', () => {
        const query = service.getMediaQuery(service.getSmallest());
        expect(query).toBeUndefined();
      });
    });

    describe('when breakpoint is Md', () => {
      it('should return a media query with min 767px', () => {
        const query = service.getMediaQuery(Breakpoint.Md);
        expect(query).toBe('@media (min-width: 767px)');
      });
    });

    describe('when breakpoint is Lg', () => {
      it('should return a media query with min 1008px', () => {
        const query = service.getMediaQuery(Breakpoint.Lg);
        expect(query).toBe('@media (min-width: 1008px)');
      });
    });
  });
});
