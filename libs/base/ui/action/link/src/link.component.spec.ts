import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { a11yConfig } from '@spryker-oryx/utilities';
import { LinkComponent } from './link.component';
import { linkComponent } from './link.def';
import { LinkType } from './link.model';

describe('LinkComponent', () => {
  let element: LinkComponent;

  beforeAll(async () => {
    await useComponent(linkComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-link');
    expect(el).toBeInstanceOf(LinkComponent);
  });

  describe('link type', () => {
    const types: LinkType[] = [LinkType.Link, LinkType.ExternalLink];
    Object.values(types).forEach((type) => {
      describe(`when linkType is "${type}"`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-link .linkType=${type}></oryx-link>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should reflect the type attribute on the node', () => {
          expect(element?.getAttribute('link-type')).toBe(type);
        });
      });
    });
  });

  describe('when link is disabled', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-link disabled></oryx-link>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should reflect the disabled attribute on the host element', () => {
      expect(element?.getAttribute('disabled')).not.toBeNull();
    });

    describe('but when it becomes not disabled', () => {
      beforeEach(async () => {
        element?.removeAttribute('disabled');
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('the host should not have disabled attribute', () => {
        expect(element.hasAttribute('disabled')).toBe(false);
      });
    });
  });

  describe('link with icon property', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-link icon="link"></oryx-link>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render icon', () => {
      expect(element?.shadowRoot?.querySelector('oryx-icon')).not.toBeNull();
    });
  });
});
