import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { CollapsibleComponent } from './collapsible.component';
import { collapsibleComponent } from './component';

describe('CollapsibleComponent', () => {
  let element: CollapsibleComponent;

  beforeAll(async () => {
    await useComponent(collapsibleComponent);
  });

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
