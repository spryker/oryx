import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing/a11y';
import { a11yConfig } from '../../../a11y';
import './index';
import { LinkComponent } from './link.component';
import { LinkTypes } from './link.model';

describe('LinkComponent', () => {
  let element: LinkComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-link');
    expect(el).to.be.instanceof(LinkComponent);
  });

  describe('link type', () => {
    const types: LinkTypes[] = [LinkTypes.Link, LinkTypes.ExternalLink];
    Object.values(types).forEach((type) => {
      describe(`when type is "${type}"`, () => {
        beforeEach(async () => {
          element = await fixture(
            html` <oryx-link type="${type}"></oryx-link>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should reflect the type attribute on the node', () => {
          expect(element?.getAttribute('type')).toBe(type);
        });
      });
    });
  });

  describe('when link is disabled', () => {
    beforeEach(async () => {
      element = await fixture(html` <oryx-link disabled></oryx-link>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should reflect the disabled attribute on the host element', () => {
      expect(element?.getAttribute('disabled')).toBeDefined();
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
      expect(element?.shadowRoot?.querySelector('oryx-icon')).toBeDefined();
    });
  });
});
