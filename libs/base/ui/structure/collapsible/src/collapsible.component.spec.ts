import { fixture, html } from '@open-wc/testing-helpers';
import { Size, useComponent } from '@spryker-oryx/utilities';
import { CollapsibleComponent } from './collapsible.component';
import { collapsibleComponent } from './collapsible.def';
import {
  CollapsibleAppearance,
  CollapsibleToggleControlType,
} from './collapsible.model';

describe('CollapsibleComponent', () => {
  let element: CollapsibleComponent;

  beforeAll(async () => {
    await useComponent(collapsibleComponent);
  });

  describe('When the open property is provided', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-collapsible open></oryx-collapsible>`);
    });

    it('should have an open attribute on the details element', () => {
      const details = element.renderRoot?.querySelector('details');
      expect(details?.hasAttribute('open')).toBe(true);
    });
  });

  describe('When the appearance is block', () => {
    describe('and the TextButton toggle control type is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible
            .appearance=${CollapsibleAppearance.Block}
            .toggleControlType=${CollapsibleToggleControlType.TextButton}
          ></oryx-collapsible>`
        );
      });

      it('should have a medium sized oryx-button', () => {
        const toggle = element.shadowRoot?.querySelector('oryx-button');
        expect(toggle?.getAttribute('size')).toBe(Size.Md);
      });
    });

    describe('and the IconButton toggle control type is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible
            .appearance=${CollapsibleAppearance.Block}
            .toggleControlType=${CollapsibleToggleControlType.IconButton}
          ></oryx-collapsible>`
        );
      });

      it('should have a medium sized oryx-icon-button', () => {
        const toggle = element.shadowRoot?.querySelector('oryx-icon-button');
        expect(toggle?.getAttribute('size')).toBe(Size.Md);
      });
    });
  });

  describe('when the appearance is inline', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-collapsible
          .appearance=${CollapsibleAppearance.Inline}
        ></oryx-collapsible>`
      );
    });

    it('should set tabindex on summary', () => {
      expect(element).toContainElement('summary[tabindex="-1"]');
    });

    describe('and the TextButton toggle control type is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible
            .appearance=${CollapsibleAppearance.Inline}
            .toggleControlType=${CollapsibleToggleControlType.TextButton}
          ></oryx-collapsible>`
        );
      });

      it('should have a medium sized oryx-button', () => {
        const toggle = element.shadowRoot?.querySelector('oryx-button');
        expect(toggle?.getAttribute('size')).toBe(Size.Sm);
      });
    });

    describe('and the IconButton toggle control type is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible
            .appearance=${CollapsibleAppearance.Inline}
            .toggleControlType=${CollapsibleToggleControlType.IconButton}
          ></oryx-collapsible>`
        );
      });

      it('should have a medium sized oryx-icon-button', () => {
        const toggle = element.shadowRoot?.querySelector('oryx-icon-button');
        expect(toggle?.getAttribute('size')).toBe(Size.Sm);
      });
    });
  });

  describe('when is not tabbable', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-collapsible nonTabbable></oryx-collapsible>`
      );
    });

    it('should set tabindex on summary', () => {
      expect(element).toContainElement('summary[tabindex="-1"]');
    });
  });
});
