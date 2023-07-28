import { fixture } from '@open-wc/testing-helpers';
import { TokenResolver } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { LinkService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { modalComponent } from '@spryker-oryx/ui/modal';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { navigationButtonComponent } from '../navigation-button/navigation-button.def';
import { SiteNavigationItemComponent } from './navigation-item.component';
import { siteNavigationItemComponent } from './navigation-item.def';
import {
  NavigationContentBehavior,
  NavigationTriggerBehavior,
  NavigationTriggerType,
} from './navigation-item.model';

class MockTokenResolver implements Partial<TokenResolver> {
  resolveToken = vi.fn().mockReturnValue(of('test'));
}

class MockSemanticLinkService implements Partial<LinkService> {
  get = vi.fn().mockReturnValue(of('/test'));
}

describe('SiteNavigationItemComponent', () => {
  let element: SiteNavigationItemComponent;
  let resolverService: MockTokenResolver;
  let semanticService: MockSemanticLinkService;

  beforeAll(async () => {
    await useComponent([
      siteNavigationItemComponent,
      navigationButtonComponent,
      modalComponent,
    ]);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: TokenResolver,
          useClass: MockTokenResolver,
        },
        {
          provide: LinkService,
          useClass: MockSemanticLinkService,
        },
      ],
    });

    resolverService = testInjector.inject(
      TokenResolver
    ) as unknown as MockTokenResolver;
    semanticService = testInjector.inject(
      LinkService
    ) as unknown as MockSemanticLinkService;

    element = await fixture(html`
      <oryx-site-navigation-item
        .options=${{ label: 'test' }}
      ></oryx-site-navigation-item>
    `);
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  const getTrigger = (): HTMLElement | null => {
    return element.renderRoot.querySelector(
      'oryx-button, oryx-site-navigation-button'
    ) as HTMLElement;
  };

  const triggerClick = (): void => {
    getTrigger()?.dispatchEvent(new MouseEvent('click'));
  };

  const triggerHover = (): void => {
    getTrigger()?.dispatchEvent(new MouseEvent('mouseenter'));
  };

  describe('when url is provided', () => {
    describe('and url is a raw string', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-site-navigation-item
            .options=${{
              url: '/test',
            }}
          ></oryx-site-navigation-item>
        `);
      });

      it('should not call semantic link service', () => {
        expect(semanticService.get).not.toHaveBeenCalled();
      });
    });

    describe('and url is a semantic link config', () => {
      const url = { type: 'link' };
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-site-navigation-item
            .options=${{
              url,
            }}
          ></oryx-site-navigation-item>
        `);
      });

      it('should pass config to the service', () => {
        expect(semanticService.get).toHaveBeenCalledWith(url);
      });
    });
  });

  describe('when label is provided', () => {
    const label = 'test';

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{ label }}
        ></oryx-site-navigation-item>
      `);
    });

    it('should resolve the label', () => {
      expect(resolverService.resolveToken).toHaveBeenCalledWith(label);
    });
  });

  describe('when badge is provided', () => {
    const badge = 'test';

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{ badge }}
        ></oryx-site-navigation-item>
      `);
    });

    it('should resolve the label', () => {
      expect(resolverService.resolveToken).toHaveBeenCalledWith(badge);
    });
  });

  describe('when contentBehavior is "navigation"', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{
            label: 'test',
            contentBehavior: NavigationContentBehavior.Navigation,
          }}
        ></oryx-site-navigation-item>
      `);
    });

    it('should not render any container', () => {
      expect(element).not.toContainElement('oryx-modal, oryx-dropdown');
    });
  });

  describe('when contentBehavior is "dropdown"', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{
            label: 'test',
            contentBehavior: NavigationContentBehavior.Dropdown,
          }}
        ></oryx-site-navigation-item>
      `);
    });

    it('should render oryx-dropdown', () => {
      expect(element).toContainElement('oryx-dropdown');
    });
  });

  describe('when contentBehavior is "modal"', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{
            label: 'test',
            contentBehavior: NavigationContentBehavior.Modal,
          }}
        ></oryx-site-navigation-item>
      `);
    });

    it('should render modal', () => {
      expect(element).toContainElement('oryx-modal');
    });

    describe('and label is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-site-navigation-item
            .options=${{
              label: 'test',
              contentBehavior: NavigationContentBehavior.Modal,
            }}
          ></oryx-site-navigation-item>
        `);
      });

      it('should render heading text', () => {
        expect(
          element.renderRoot
            .querySelector('oryx-modal')
            ?.shadowRoot?.querySelector('header')?.innerText
        ).toContain('test');
      });
    });
  });

  describe('when triggerType is "button"', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{
            label: 'test',
            triggerType: NavigationTriggerType.Button,
          }}
        ></oryx-site-navigation-item>
      `);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render oryx-button', () => {
      expect(element).toContainElement('oryx-button');
    });

    describe('and icon is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-site-navigation-item
            .options=${{
              label: 'test',
              icon: 'test',
              triggerType: NavigationTriggerType.Button,
            }}
          ></oryx-site-navigation-item>
        `);
      });

      it('should render oryx-icon', () => {
        expect(element).toContainElement(`oryx-button[icon="test"]`);
      });
    });

    describe('and url is provided', () => {
      const url = '/test';
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-site-navigation-item
            .options=${{
              label: 'test',
              url,
              triggerType: NavigationTriggerType.Button,
            }}
          ></oryx-site-navigation-item>
        `);
      });

      it('should render anchor element inside oryx-button with given url', () => {
        expect(element).toContainElement(`oryx-button[href="${url}"]`);
      });
    });
  });

  describe('when triggerType is "icon"', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{ triggerType: NavigationTriggerType.Icon }}
        ></oryx-site-navigation-item>
      `);
    });

    it('should render oryx-button with icon type', () => {
      expect(element).toContainElement(
        `oryx-button[type="${ButtonType.Icon}"]`
      );
    });

    describe('and icon is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-site-navigation-item
            .options=${{
              label: 'test',
              icon: 'test',
              triggerType: NavigationTriggerType.Icon,
            }}
          ></oryx-site-navigation-item>
        `);
      });

      it('should render oryx-icon', () => {
        expect(element).toContainElement(`oryx-button[icon="test"]`);
      });
    });

    describe('and url is provided', () => {
      const url = '/test';
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-site-navigation-item
            .options=${{
              label: 'test',
              url,
              triggerType: NavigationTriggerType.Icon,
            }}
          ></oryx-site-navigation-item>
        `);
      });

      it('should render anchor element inside oryx-button with given url', () => {
        expect(element).toContainElement(`oryx-button[href="${url}"]`);
      });
    });
  });

  describe('when triggerType is "storefront-button"', () => {
    const options = {
      url: '/test',
      icon: 'test',
      label: 'test',
      badge: 'test',
    };
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-site-navigation-item
          .options=${{
            triggerType: NavigationTriggerType.StorefrontButton,
            ...options,
          }}
        ></oryx-site-navigation-item>
      `);
    });

    it('should pass all related options to the oryx-site-navigation-button', () => {
      const trigger = getTrigger() as any;
      expect(trigger.url).toBe(options.url);
      expect(trigger.icon).toBe(options.icon);
      expect(trigger.text).toBe(options.label);
      expect(trigger.badge).toBe(options.badge);
    });
  });

  [
    NavigationTriggerType.Button,
    NavigationTriggerType.Icon,
    NavigationTriggerType.StorefrontButton,
  ].forEach((triggerType) => {
    describe(`trigger behaviors for trigger type ${triggerType}`, () => {
      describe('when triggerBehavior is "click"', () => {
        describe('and trigger is clicked', () => {
          describe('and contentBehavior is "modal"', () => {
            beforeEach(async () => {
              element = await fixture(html`
                <oryx-site-navigation-item
                  .options=${{
                    label: 'test',
                    triggerType,
                    triggerBehavior: NavigationTriggerBehavior.Click,
                    contentBehavior: NavigationContentBehavior.Modal,
                  }}
                ></oryx-site-navigation-item>
              `);
              triggerClick();
            });

            it('should open the modal', () => {
              expect(element).toContainElement(`oryx-modal[open]`);
            });
          });
        });

        describe('and trigger is hovered', () => {
          describe('and contentBehavior is "modal"', () => {
            beforeEach(async () => {
              element = await fixture(html`
                <oryx-site-navigation-item
                  .options=${{
                    label: 'test',
                    triggerType,
                    triggerBehavior: NavigationTriggerBehavior.Click,
                    contentBehavior: NavigationContentBehavior.Modal,
                  }}
                ></oryx-site-navigation-item>
              `);
              triggerHover();
            });

            it('should not open the modal', () => {
              expect(element).not.toContainElement(`oryx-modal[open]`);
            });
          });
        });
      });

      describe('when triggerBehavior is "hover"', () => {
        describe('and trigger is hovered', () => {
          describe('and contentBehavior is "modal"', () => {
            beforeEach(async () => {
              element = await fixture(html`
                <oryx-site-navigation-item
                  .options=${{
                    label: 'test',
                    triggerType,
                    triggerBehavior: NavigationTriggerBehavior.Hover,
                    contentBehavior: NavigationContentBehavior.Modal,
                  }}
                ></oryx-site-navigation-item>
              `);
              triggerHover();
            });

            it('should open the modal', () => {
              expect(element).toContainElement(`oryx-modal[open]`);
            });
          });
        });
      });
    });
  });
});
