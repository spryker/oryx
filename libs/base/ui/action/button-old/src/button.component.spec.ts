import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { IconComponent, IconTypes } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/utilities';
import { ButtonComponent } from './button.component';
import { buttonComponent } from './button.def';
import { ButtonType } from './button.model';

describe('ButtonComponent', () => {
  let element: ButtonComponent;

  beforeAll(async () => {
    await useComponent(buttonComponent);
  });

  describe('when the element is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-button><button>text</button></oryx-button>`
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('type', () => {
    Object.values(ButtonType).forEach((type) => {
      describe(`when the type is set to ${type}`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-button type="${type}" size="sm"></oryx-button>`
          );
        });

        it('should reflect the type attribute on the node', () => {
          expect(element?.getAttribute('type')).toBe(type);
        });
      });
    });
  });

  describe('size', () => {
    [Size.Lg, Size.Md, Size.Sm].forEach((size) => {
      describe(`when the size is set to ${size}`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-button size="${size}"></oryx-button>`
          );
        });

        it('should reflect the size attribute on the node', () => {
          expect(element?.getAttribute('size')).toBe(size);
        });
      });
    });
  });

  describe('loading', () => {
    describe('when the loading property is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-button><button></button></oryx-button>`
        );
      });

      it('should not reflect the loading attribute on the node', () => {
        expect(element?.hasAttribute('loading')).toBe(false);
      });

      it('should not have a loading icon', () => {
        expect(element).not.toContainElement('oryx-icon');
      });

      it('should not have inert attribute on slot', () => {
        expect(element).not.toContainElement('slot[inert]');
      });
    });

    describe('when the loading property is set to true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-button .loading=${true}><button></button></oryx-button>`
        );
      });

      it('should  reflect the loading attribute on the node', () => {
        expect(element?.hasAttribute('loading')).toBe(true);
      });

      it('should have a loading icon', () => {
        const icon = element.renderRoot.querySelector(
          'oryx-icon'
        ) as IconComponent;
        expect(icon.type).toBe(IconTypes.Loader);
      });

      it('should have inert attribute on slot', () => {
        expect(element).toContainElement('slot[inert]');
      });
    });
  });

  describe('confirmed', () => {
    describe('when the confirmed property is true', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-button .confirmed=${true}></oryx-button>`
        );
      });

      it('should reflect the property in the DOM', () => {
        expect(element.hasAttribute('confirmed')).toBe(true);
      });

      it('should have a confirmed icon', () => {
        const icon = element.renderRoot.querySelector(
          'oryx-icon'
        ) as IconComponent;
        expect(icon.type).toBe(IconTypes.Check);
      });

      describe('and the property is set to false afterwards', () => {
        beforeEach(() => {
          element.confirmed = false;
        });

        it('should reflect the property in the DOM', () => {
          expect(element.hasAttribute('confirmed')).toBe(false);
        });
      });
    });

    describe('when the confirmed property is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-button></oryx-button>`);
      });

      it('should not reflect the property in the DOM', () => {
        expect(element.hasAttribute('confirmed')).toBe(false);
      });

      it('should not have a loading icon', () => {
        expect(element).not.toContainElement('oryx-icon');
      });

      describe('and the property is set to true afterwards', () => {
        beforeEach(() => {
          element.confirmed = true;
        });

        it('should reflect the property in the DOM', () => {
          expect(element.hasAttribute('confirmed')).toBe(true);
        });
      });
    });
  });

  describe('outline', () => {
    describe(`when the outline is set to true`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-button ?outline=${true}></oryx-button>`
        );
      });

      it('should reflect the outline attribute on the node', () => {
        expect(element?.hasAttribute('outline')).toBe(true);
      });
    });

    describe(`when the outline is not set`, () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-button></oryx-button>`);
      });

      it('should not reflect the outline attribute on the node', () => {
        expect(element?.hasAttribute('outline')).toBe(false);
      });
    });
  });
});
