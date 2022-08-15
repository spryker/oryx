import { MOCK_CART_PROVIDERS } from '@spryker-oryx/cart';
import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { useComponent } from '@spryker-oryx/core/utilities';
import { RouteParams, RouterService } from '@spryker-oryx/experience';
import {
  createInjector,
  destroyInjector,
  getInjector,
} from '@spryker-oryx/injector';
import { SEMANTIC_LINK_PROVIDERS } from '@spryker-oryx/site';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import 'urlpattern-polyfill';
import {
  storefrontComponent,
  StorefrontComponent,
} from './storefront.component';

useComponent(storefrontComponent);

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

describe('InputComponent', () => {
  let routerService: MockRouterService;
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
        ...SEMANTIC_LINK_PROVIDERS,
        ...MOCK_CART_PROVIDERS,
      ],
    });

    routerService = getInjector().inject(
      RouterService
    ) as unknown as MockRouterService;
    routerService.go('/');

    document.body.innerHTML = '<storefront-component></storefront-component>';
  });

  afterEach(() => {
    destroyInjector();
  });

  const getElement = (): StorefrontComponent => {
    return document.body.querySelector('storefront-component');
  };

  it('should render `experience-composition` tag', () => {
    const element = getElement();
    const experienceComposition = element.shadowRoot?.querySelector(
      'experience-composition'
    );

    expect(element).toBeInstanceOf(StorefrontComponent);
    expect(experienceComposition).toBeTruthy();
  });

  it('should render `experience-composition` with `route` attributes passed from the `route` property', async () => {
    const mockRout = '/contact';
    const element = getElement();
    const experienceComposition = element.shadowRoot?.querySelector(
      'experience-composition'
    );

    expect(experienceComposition.getAttribute('route')).toBe('/');

    routerService.go(mockRout);

    routerService.currentParams().subscribe((value) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const updatedExperienceComposition = getShadowElementBySelector(
        getElement(),
        'experience-composition'
      );
      expect(updatedExperienceComposition.getAttribute('route')).toBe(mockRout);
    });
  });
});
