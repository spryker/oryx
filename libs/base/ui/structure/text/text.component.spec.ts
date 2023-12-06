import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { TextComponent } from './text.component';
import { textComponent } from './text.def';

describe('TextComponent', () => {
  let element: TextComponent;

  beforeAll(async () => {
    await useComponent(textComponent);
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-text></oryx-text>`);
    });

    it('should defined', () => {
      expect(element).toBeInstanceOf(TextComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('when content contains tags', () => {
    describe('featureVersion < 1.3', () => {
      beforeEach(async () => {
        mockFeatureVersion('1.3');
        element = await fixture(
          html`<oryx-text
            .content=${'<h1>This is the content</h1><p>with a <a href="/link">link</a></p>'}
          ></oryx-text>`
        );
      });

      it('should render the html as-is', () => {
        expect(element).toContainElement(`h1 + p > a[href='/link']`);
      });

      it('should not render oryx design system components', () => {
        expect(element).not.toContainElement(`oryx-heading`);
        expect(element).not.toContainElement(`oryx-link`);
      });
    });
  });

  describe('when the featureVersion >= 1.4', () => {
    beforeEach(async () => {
      mockFeatureVersion('1.4');
      element = await fixture(
        html`<oryx-text
          .content=${'<h1>This is the content</h1><p>with a <a href="/link">link</a> and a <button>but</button>'}
        ></oryx-text>`
      );
    });

    describe('and the content contains standard heading tags', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text
            .content=${`
              <h1 style="margin:10px" class="foo-bar" foo="bar">This is the content</h1><p>with a 
              <a href="/link">link</a></p><p>and a <button>but</button>`}
          ></oryx-text>`
        );
      });

      it('should render oryx design system components', () => {
        expect(element).toContainElement(`oryx-heading`);
        expect(element).toContainElement(`oryx-link`);
        expect(element).toContainElement(`oryx-button`);
      });
    });

    describe('and the content contains not standard heading tags', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text
            .content=${`foo <small>small</small> bar <span class="caption">cap</span> 
            baz <span class="subtitle">subtitle</span> qux  
            baz <b>b</b> qux  
            baz <strong>b</strong> qux  
            `}
          ></oryx-text>`
        );
      });

      it('should render oryx-heading components', () => {
        expect(element).toContainElement(`oryx-heading[tag='small']`);
        expect(element).toContainElement(`oryx-heading[typography='caption']`);
        expect(element).toContainElement(`oryx-heading[typography='subtitle']`);
        expect(element).toContainElement(`oryx-heading[tag='strong']`);
      });
    });

    describe('and the tags contain attributes', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text
            .content=${'<h1 style="margin:10px" class="foo-bar" foo="bar">This is the content</h1>'}
          ></oryx-text>`
        );
      });

      it('should remain the attributes', () => {
        expect(element).toContainElement(
          `oryx-heading[style="margin:10px"][class="foo-bar"][foo="bar"]`
        );
      });
    });
  });
});
