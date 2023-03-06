import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { Size } from '@spryker-oryx/ui';
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

  describe('When the appearance is inline', () => {
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
});
