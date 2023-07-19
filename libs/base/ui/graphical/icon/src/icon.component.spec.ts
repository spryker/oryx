import { fixture } from '@open-wc/testing-helpers';
import { a11yConfig, Size, useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { IconComponent } from './icon.component';
import { iconComponent } from './icon.def';
import { IconTypes } from './icon.types';

describe('Icon', () => {
  let element: IconComponent;

  beforeAll(async () => {
    await useComponent(iconComponent);
  });

  describe('when no type is given', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-icon></oryx-icon>`);
    });

    it('is defined', () => {
      expect(element).toBeInstanceOf(IconComponent);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should not render an SVG element', () => {
      const svg = element?.shadowRoot?.querySelector('svg');
      expect(svg).toBeNull();
    });
  });

  describe('when type is "searchbox"', () => {
    describe('and sprite is defined', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-icon
            sprite="/assets/icons.svg"
            .type=${IconTypes.Search}
          ></oryx-icon>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render an SVG element', () => {
        const svg = element?.shadowRoot?.querySelector('svg');
        expect(svg).not.toBeNull();
      });

      it('should reference an external SVG and include searchbox ID', () => {
        const svg = element?.shadowRoot?.querySelector('svg use');
        expect(svg?.getAttribute('href')).toBe(
          `/assets/icons.svg#${IconTypes.Search}`
        );
      });
    });
  });

  describe('icon size', () => {
    [Size.Lg, Size.Md, Size.Sm].forEach((size) => {
      describe(`when size is "${size}"`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-icon
              type=${IconTypes.Search}
              size="${size}"
            ></oryx-icon>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should reflect the attribute on the node', () => {
          expect(element?.getAttribute('size')).toBe(size);
        });
      });
    });
  });

  describe('when custom SVG icon is slotted in', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-icon>
        <svg viewBox="0 0 24 24" id="customSvg">
          <path
            d="M8.44464 12.2581C8.44464 10.3055 10.0275 8.72258 11.9801 8.72258C13.9318 8.72486 15.5133 10.3064 15.5156 12.2581C15.5156 14.2107 13.9327 15.7935 11.9801 15.7935C10.0275 15.7935 8.44464 14.2107 8.44464 12.2581Z"
          />
          <path
            d="M12.0059 4C4.136 4 0.980382 9.67123 0.130318 11.6139C-0.0485177 12.0228 -0.0430662 12.4888 0.145286 12.8934C1.04438 14.8289 4.33883 20.5161 12.0059 20.5161C19.6963 20.5161 22.9479 14.7974 23.8253 12.8774C24.0058 12.4822 24.011 12.0292 23.8397 11.6299C23.0139 9.70271 19.8981 4 12.0059 4ZM11.9801 17.8581C8.88733 17.8581 6.38012 15.3509 6.38012 12.2581C6.38012 9.16527 8.88733 6.65806 11.9801 6.65806C15.0729 6.65806 17.5801 9.16527 17.5801 12.2581C17.5767 15.3494 15.0715 17.8547 11.9801 17.8581Z"
          />
        </svg>
      </oryx-icon>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should not reference an external SVG', () => {
      expect(element?.shadowRoot?.querySelector('svg use')).toBeNull();
    });
  });
});
