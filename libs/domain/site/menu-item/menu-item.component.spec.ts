import { fixture } from '@open-wc/testing-helpers';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { ButtonComponent } from '@spryker-oryx/ui/button';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { SiteMenuItemComponent } from './menu-item.component';
import { siteMenuItemComponent } from './menu-item.def';
import { SiteMenuItemVariation } from './menu-item.model';

class MockLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/'));
}

class MockRouterService implements Partial<RouterService> {
  route = vi.fn().mockReturnValue(of('/'));
}

describe('SiteMenuItemComponent', () => {
  let element: SiteMenuItemComponent;
  let routerService: MockRouterService;
  let linkService: MockLinkService;

  beforeAll(async () => {
    await useComponent(siteMenuItemComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: LinkService,
          useClass: MockLinkService,
        },
        {
          provide: RouterService,
          useClass: MockRouterService,
        },
      ],
    });

    routerService = testInjector.inject(
      RouterService
    ) as unknown as MockRouterService;
    linkService = testInjector.inject(
      LinkService
    ) as unknown as MockLinkService;

    element = await fixture(
      html`<oryx-site-menu-item
        .content=${{ text: 'mock' }}
      ></oryx-site-menu-item>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(SiteMenuItemComponent);
  });

  it('should pass the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render its components', () => {
    expect(element.renderRoot.querySelector('oryx-button')).not.toBeNull();
  });

  it('should pass text to oryx button', () => {
    expect(
      (element.renderRoot.querySelector('oryx-button') as ButtonComponent).text
    ).toBe('mock');
  });

  it('should not be highlighted', () => {
    expect(element.renderRoot.querySelector('.active')).toBeNull();
  });

  it('should have variation attribute', () => {
    expect(element.getAttribute('variation')).toBe(
      SiteMenuItemVariation.Navigation
    );
  });

  describe('when item is active', () => {
    beforeEach(async () => {
      routerService.route.mockReturnValue(of('/mock'));

      element = await fixture(
        html`<oryx-site-menu-item
          .options=${{ url: '/mock' }}
        ></oryx-site-menu-item>`
      );
    });

    it('should highlight item', () => {
      expect(element.renderRoot.querySelector('.active')).not.toBeNull();
    });
  });

  describe('when url is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-menu-item
          .options=${{ url: '/mock' }}
        ></oryx-site-menu-item>`
      );
    });

    it('should render href', () => {
      expect(
        element.renderRoot.querySelector('oryx-button[href="/mock"]')
      ).not.toBeNull();
    });
  });

  describe('when type is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-menu-item
          .options=${{ type: 'mock', id: 'id' }}
        ></oryx-site-menu-item>`
      );
    });

    it('should call link service', () => {
      expect(linkService.get).toHaveBeenCalledWith({ type: 'mock', id: 'id' });
    });
  });

  describe('when type or url are not provided', () => {
    it('should not render href attribute', () => {
      expect(element.renderRoot.querySelector('[href]')).toBeNull();
    });
  });

  describe('when icon is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-menu-item
          .options=${{ icon: 'mockicon' }}
        ></oryx-site-menu-item>`
      );
    });

    it('should pass icon to oryx button', () => {
      expect(
        (element.renderRoot.querySelector('oryx-button') as ButtonComponent)
          .icon
      ).toBe('mockicon');
    });
  });
});
