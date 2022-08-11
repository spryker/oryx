import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { CollapsibleComponent } from './collapsible.component';
import { collapsibleComponent } from './index';

useComponent(collapsibleComponent);

describe('CollapsibleComponent', () => {
  let element: CollapsibleComponent;

  describe('native details element', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-collapsible open></oryx-collapsible>`);
    });

    it('should have open attribute', async () => {
      const details = element.renderRoot?.querySelector('details');

      expect(details?.hasAttribute('open')).toBe(true);
    });
  });
});
