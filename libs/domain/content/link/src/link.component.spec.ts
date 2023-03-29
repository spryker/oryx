import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { ExperienceService } from '@spryker-oryx/experience';
import { SemanticLinkType, siteProviders } from '@spryker-oryx/site';
import { LinkComponent } from '@spryker-oryx/ui/link';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { ContentLinkComponent } from './link.component';
import { contentLinkComponent } from './link.def';
import { ContentLinkOptions, ContentLinkType } from './link.model';

class MockService {
  getOptions(): Observable<ContentLinkOptions> {
    return of({});
  }
}

describe('ContentLinkComponent', () => {
  let element: ContentLinkComponent;
  const options = {
    text: 'test',
    type: ContentLinkType.RawUrl,
    id: 'test',
  };

  beforeAll(async () => {
    await useComponent(contentLinkComponent);
  });

  beforeEach(async () => {
    createInjector({
      providers: [
        {
          provide: ExperienceService,
          useClass: MockService,
        },
        ...siteProviders,
      ],
    });

    element = await fixture(
      html`<oryx-content-link .options=${options}></oryx-content-link>`
    );
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(ContentLinkComponent);
  });

  it('should render the correct link', () => {
    expect(element).toContainElement('a[href="test"]');
  });

  it('should pass the text to the link', () => {
    expect(element?.shadowRoot?.querySelector('a')?.innerText).toBe('test');
  });

  describe('when type is provided', () => {
    [
      {
        type: SemanticLinkType.Page,
        expectation: 'a[href="/test"]',
      },
      {
        type: ContentLinkType.RawUrl,
        expectation: 'a[href="test"]',
      },
    ].forEach(({ type, expectation }) => {
      describe(`and type is ${type}`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-content-link
              .options=${{
                ...options,
                type,
              }}
            ></oryx-content-link>`
          );
        });

        it('should build the correct link', () => {
          expect(element).toContainElement(expectation);
        });
      });
    });
  });

  describe('when type is not provided', () => {
    describe('and id is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-link
            .options=${{
              id: 'test',
            }}
          ></oryx-content-link>`
        );
      });

      it('should render the oryx-link', () => {
        expect(element).toContainElement('oryx-link');
      });
    });

    describe('and id is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-content-link></oryx-content-link>`);
      });

      it('should not render the oryx-link', () => {
        expect(element).not.toContainElement('oryx-link');
      });
    });
  });

  describe('when rels options are provided', () => {
    describe('and "noopener" is provided only', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-link
            .options=${{ ...options, noopener: true }}
          ></oryx-content-link>`
        );
      });

      it('should combine correct attribute', () => {
        expect(element).toContainElement('a[rel=noopener]');
      });
    });

    describe('and "nofollow" is provided only', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-link
            .options=${{ ...options, nofollow: true }}
          ></oryx-content-link>`
        );
      });

      it('should combine correct attribute', () => {
        expect(element).toContainElement('a[rel=nofollow]');
      });
    });

    describe('and "noopener" and "nofollow" are provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-content-link
            .options=${{ ...options, noopener: true, nofollow: true }}
          ></oryx-content-link>`
        );
      });

      it('should combine correct attribute', () => {
        expect(element).toContainElement('a[rel="noopener nofollow"]');
      });
    });
  });

  describe('when label is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ ...options, label: 'test' }}
        ></oryx-content-link>`
      );
    });

    it('should pass set aria-label on the link', () => {
      expect(element).toContainElement('a[aria-label]');
    });
  });

  describe('when target is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ ...options, target: '_blank' }}
        ></oryx-content-link>`
      );
    });

    it('should pass set target on the link', () => {
      expect(element).toContainElement('a[target]');
    });
  });

  describe('when icon is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ ...options, icon: 'test' }}
        ></oryx-content-link>`
      );
    });

    it('should pass the icon to oryx-link', () => {
      const iconEl =
        element.shadowRoot?.querySelector<LinkComponent>('oryx-link');
      expect(iconEl?.icon).toBe('test');
    });
  });

  describe('when disabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ ...options, disabled: true }}
        ></oryx-content-link>`
      );
    });

    it('should pass the attribute to oryx-link', () => {
      expect(element).toContainElement('oryx-link[disabled]');
    });
  });

  describe('when button option is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-content-link
          .options=${{ ...options, button: true }}
        ></oryx-content-link>`
      );
    });

    it('should render oryx-button', () => {
      expect(element).toContainElement('oryx-button');
    });
  });
});
