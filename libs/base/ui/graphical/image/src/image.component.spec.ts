import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { ImageComponent } from './image.component';
import { imageComponent } from './image.def';
import { LoadingStrategy } from './image.model';

describe('ImageComponent', () => {
  let element: ImageComponent;

  beforeAll(async () => {
    await useComponent(imageComponent);
  });

  describe('when the src is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-image
        src="mock.jpg"
        alt="keep the web accessible"
      ></oryx-image>`);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the img element', () => {
      expect(element).toContainElement('img');
    });

    it('should not render a srcset attribute', () => {
      expect(element).not.toContainElement('img[srcset]');
    });

    it('should not render the fallback icon', () => {
      expect(element).not.toContainElement('oryx-icon');
    });
  });

  describe('when the src is not provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-image></oryx-image>`);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should not render the img element', () => {
      expect(element).not.toContainElement('img');
    });

    it('should render the fallback icon', () => {
      expect(element).toContainElement('oryx-icon');
    });

    describe('and the fallback should be skipped', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-image skipFallback></oryx-image>`);
      });

      it('should not render the img element', () => {
        expect(element).not.toContainElement('img');
      });

      it('should not render the fallback icon', () => {
        expect(element).not.toContainElement('oryx-icon');
      });
    });
  });

  describe('when the src is causing an error', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-image src="mock.jpg"></oryx-image>`);
      const img = element.shadowRoot?.querySelector('img');
      img?.dispatchEvent(new Event('error'));
    });

    it('should render the fallback icon', () => {
      expect(element).toContainElement('oryx-icon');
    });

    it('should not render the img element', () => {
      expect(element).not.toContainElement('img');
    });
  });

  describe('when srcset is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-image
        src="mock.jpg"
        srcset="mock.jpg 2x"
        alt="keep the web accessible"
      ></oryx-image>`);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it('should render the img element', () => {
      const img = element.shadowRoot?.querySelector('img');
      expect(img?.src).toContain('mock.jpg');
    });

    it('should render a srcset with the density', () => {
      expect(element).toContainElement('img[srcset="mock.jpg 2x"]');
    });

    it('should not render the fallback icon', () => {
      expect(element).not.toContainElement('oryx-icon');
    });
  });

  describe('alt', () => {
    describe('when alt attribute is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-image src="mock.jpg" alt="Mock alt text"></oryx-image>`
        );
      });

      it('should reflect the alt attribute on the img element', () => {
        expect(element).toContainElement('img[alt="Mock alt text"]');
      });
    });

    describe('when alt attribute is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-image src="mock.jpg"></oryx-image>`);
      });

      it('should not have an alt attribute on the img element', () => {
        expect(element).toContainElement('img:not([alt])');
      });

      it('should not pass the a11y audit', async () => {
        await expect(element).shadowDom.not.to.be.accessible();
      });
    });
  });

  describe('loading', () => {
    describe('when the loading strategy is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-image src="mock.jpg"></oryx-image>`);
      });

      it('should not use any strategy', () => {
        const img = element.shadowRoot?.querySelector('img');
        expect(img?.loading).toBeUndefined();
      });
    });

    describe('when eager loading strategy is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-image
            src="mock.jpg"
            loading=${LoadingStrategy.Eager}
          ></oryx-image>`
        );
      });

      it('should eager load the image', () => {
        expect(element).toContainElement('img[loading="eager"]');
      });
    });

    describe('when lazy loading strategy is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-image
            src="mock.jpg"
            loading=${LoadingStrategy.Lazy}
          ></oryx-image>`
        );
      });

      it('should lazy load the image', () => {
        expect(element).toContainElement('img[loading="lazy"]');
      });
    });
  });
});
