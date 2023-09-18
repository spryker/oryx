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
  isCurrentRoute = vi.fn().mockReturnValue(of(false));
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
    expect(element).toContainElement('oryx-button');
  });

  it('should pass text to oryx button', () => {
    expect(
      element.renderRoot.querySelector<ButtonComponent>('oryx-button')?.text
    ).toBe('mock');
  });

  it('should not be highlighted', () => {
    expect(element).not.toContainElement('oryx-button.active');
  });

  it('should not render href', () => {
    expect(element).not.toContainElement('oryx-button[href]');
  });

  it('should have variation attribute', () => {
    expect(element.getAttribute('variation')).toBe(
      SiteMenuItemVariation.Navigation
    );
  });

  describe('when item is active', () => {
    beforeEach(async () => {
      routerService.isCurrentRoute.mockReturnValue(of(true));

      element = await fixture(
        html`<oryx-site-menu-item
          .options=${{ url: '/mock' }}
        ></oryx-site-menu-item>`
      );
    });

    it('should highlight item', () => {
      expect(element).toContainElement('oryx-button.active');
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
      expect(element).toContainElement('oryx-button[href="/mock"]');
    });

    describe('and url is a LinkOption', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-site-menu-item
            .options=${{ url: { type: 'mock', id: 'id' } }}
          ></oryx-site-menu-item>`
        );
      });

      it('should render correct link', () => {
        expect(element).toContainElement('oryx-button[href="/"]');
      });
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
        element.renderRoot.querySelector<ButtonComponent>('oryx-button')?.icon
      ).toBe('mockicon');
    });
  });
});
