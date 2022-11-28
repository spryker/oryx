import { mockCartProviders } from '@spryker-oryx/cart/mocks';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { RouteParams, RouterService } from '@spryker-oryx/experience';
import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import { siteProviders } from '@spryker-oryx/site';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RootAppComponent } from './root-app.component';
import { rootAppComponent } from './root-app.def';

class MockRouterService implements Partial<RouterService> {
  private router$ = new BehaviorSubject('');
  private params$: Subject<RouteParams> = new Subject();

  go(route: string): void {
    this.router$.next(route);
  }
  currentRoute(): Observable<string> {
    return this.router$;
  }
  currentParams(): Observable<RouteParams> {
    return this.params$;
  }
  acceptParams(params: RouteParams): void {
    this.params$.next(params);
  }
}

describe('RootAppComponent', () => {
  let routerService: MockRouterService;

  beforeAll(async () => {
    await useComponent(rootAppComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
        ...siteProviders,
        ...mockCartProviders,
      ],
    });

    routerService = getInjector().inject(
      RouterService
    ) as unknown as MockRouterService;
    routerService.go('/');

    document.body.innerHTML = '<root-app></root-app>';
  });

  afterEach(() => {
    destroyInjector();
  });

  const getElement = (): RootAppComponent => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return document.body.querySelector('root-app')!;
  };

  it('should render `experience-composition` tag', () => {
    const element = getElement();
    const experienceComposition = element.shadowRoot?.querySelector(
      'experience-composition[route]'
    );

    expect(element).toBeInstanceOf(RootAppComponent);
    expect(experienceComposition).toBeTruthy();
  });

  it('should render `experience-composition` with `route` attributes passed from the `route` property', async (done) => {
    const mockRout = '/contact';
    const element = getElement();
    const experienceComposition = element.shadowRoot?.querySelector(
      'experience-composition[route]'
    );

    expect(experienceComposition?.getAttribute('route')).toBe('/');

    routerService.go(mockRout);

    routerService.currentParams().subscribe(() => {
      const updatedExperienceComposition = getShadowElementBySelector(
        getElement(),
        'experience-composition[route]'
      );
      expect(updatedExperienceComposition?.getAttribute('route')).toBe(
        mockRout
      );
    });
  });
});
