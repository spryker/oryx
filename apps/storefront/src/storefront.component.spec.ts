import { ContextService, DefaultContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/injector';
import './storefront.component';
import { StorefrontComponent } from './storefront.component';

describe('InputComponent', () => {
  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ContextService,
          useClass: DefaultContextService,
        },
      ],
    });

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

  it('should render `experience-composition` with `key` attributes passed from the `route` property', async () => {
    const mockRout = 'mockRout';
    const element = getElement();
    const experienceComposition = element.shadowRoot?.querySelector(
      'experience-composition'
    );

    expect(experienceComposition.getAttribute('key')).toBe('/');

    element.setAttribute('route', mockRout);

    element.requestUpdate();
    await element.updateComplete;

    expect(experienceComposition.getAttribute('key')).toBe(mockRout);
  });
});
