// organize-imports-ignore
import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { ButtonComponent } from '../../action/button/src/button.component.js';
import { ButtonType } from '../../action/button/src/button.model.js';
import { CollapsibleTextComponent } from './collapsible-text.component';
import { collapsibleTextComponent } from './collapsible-text.def';
import { CollapsibleTextToggle } from './collapsible-text.model';
import './ponyfill';

describe('CollapsibleTextComponent', () => {
  let element: CollapsibleTextComponent;

  beforeAll(async () => {
    await useComponent(collapsibleTextComponent);
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-collapsible-text></oryx-collapsible-text>`
      );
    });

    it('should defined', () => {
      expect(element).toBeInstanceOf(CollapsibleTextComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe('CollapsibleTextToggle property', () => {
    describe('when toggle property not provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible-text></oryx-collapsible-text>`
        );
      });

      it('should not have a toggle button', () => {
        expect(element).not.toContainElement('button');
      });
    });

    describe('when toggle property = none', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible-text
            .toggle=${CollapsibleTextToggle.None}
          ></oryx-collapsible-text>`
        );
      });

      it('should not have a toggle button', () => {
        expect(element).not.toContainElement('button');
      });
    });

    describe('when enableToggle property = icon', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible-text
            .toggle=${CollapsibleTextToggle.Icon}
          ></oryx-collapsible-text>`
        );
      });

      it('should have a toggle button', () => {
        expect(element).toContainElement('oryx-icon-button button');
      });

      it('should have Read more aria label', () => {
        const button = element.renderRoot.querySelector('button');
        expect(button?.getAttribute('aria-label')).toBe('Read more');
      });

      describe('and when the button is clicked', () => {
        beforeEach(() => {
          element.renderRoot.querySelector('button')?.click();
        });

        it('should have Read less aria label', () => {
          expect(element).toContainElement('button[aria-label="Read less"]');
        });
      });
    });

    describe('when enableToggle property = text', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible-text
            .toggle=${CollapsibleTextToggle.Text}
          ></oryx-collapsible-text>`
        );
      });

      it('should have a text button', () => {
        const button =
          element.renderRoot.querySelector<ButtonComponent>('oryx-button');
        expect(button?.type).toBe(ButtonType.Text);
      });

      it('should have Read more text', () => {
        const button = element.renderRoot.querySelector('button');
        expect(button?.textContent).toContain('Read more');
      });

      describe('and when the button is clicked', () => {
        beforeEach(() => {
          element.renderRoot.querySelector('button')?.click();
        });

        it('should have Read less aria label', () => {
          const button = element.renderRoot.querySelector('button');
          expect(button?.textContent).toContain('Read less');
        });
      });
    });
  });

  describe('lineClamp property', () => {
    describe('when the clamp property is 3', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible-text .lineClamp=${3}></oryx-collapsible-text>`
        );
      });

      it('should have a --line-clamp property', () => {
        const slot = element.renderRoot.querySelector('slot') as HTMLElement;
        expect(slot.style.getPropertyValue('--line-clamp')).toBe('3');
      });
    });
  });
});
