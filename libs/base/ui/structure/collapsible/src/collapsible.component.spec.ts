import { fixture, html } from '@open-wc/testing-helpers';
import { ButtonSize } from '@spryker-oryx/ui/button';
import { useComponent } from '@spryker-oryx/utilities';
import { CollapsibleComponent } from './collapsible.component';
import { collapsibleComponent } from './collapsible.def';
import { CollapsibleAppearance } from './collapsible.model';

describe('CollapsibleComponent', () => {
  let element: CollapsibleComponent;

  beforeAll(async () => {
    await useComponent(collapsibleComponent);
  });

  describe('when the version >= 1.2', () => {
    beforeEach(() => {
      mockFeatureVersion('1.2');
    });

    describe('when the open property is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-collapsible open></oryx-collapsible>`
        );
        element.scrollIntoView = vi.fn();
      });

      it('should have an open attribute on the details element', () => {
        expect(element).toContainElement('details[open]');
      });

      it('should not scroll the element into the view port', () => {
        expect(element.scrollIntoView).not.toHaveBeenCalled();
      });
    });

    describe('when the open property is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-collapsible></oryx-collapsible>`);
        element.scrollIntoView = vi.fn();
      });

      it('should not have an open attribute on the details element', () => {
        expect(element).not.toContainElement('details[open]');
      });

      describe('and when the element is clicked', () => {
        beforeEach(async () => {
          const details = element.renderRoot.querySelector('details');
          if (details) {
            details.click();
            details.open = true;
            details.dispatchEvent(new Event('toggle'));
          }
        });

        it('should have an open attribute on the details element', () => {
          expect(element).toContainElement('details[open]');
        });

        it('should scroll the element into the view port', () => {
          expect(element.scrollIntoView).toHaveBeenCalled();
        });
      });
    });
  });

  describe('When the appearance is block', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-collapsible
          .appearance=${CollapsibleAppearance.Block}
        ></oryx-collapsible>`
      );
    });

    it('should have a small sized oryx-button', () => {
      const button = element.renderRoot.querySelector('oryx-button');
      expect(button).toHaveProperty('size', ButtonSize.Sm);
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
