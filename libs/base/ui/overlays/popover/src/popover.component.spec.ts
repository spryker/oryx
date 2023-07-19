import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { popoverComponent } from './component';
import { PopoverComponent } from './popover.component';

describe('PopoverComponent', () => {
  let element: PopoverComponent;

  beforeAll(async () => {
    await useComponent(popoverComponent);
  });

  describe('when light dom is added to the default slot', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-popover>
        <div id="light-dom">popover content</div>
      </oryx-popover>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render the light dom content', () => {
      expect(element.querySelector('#light-dom')).not.toBeNull();
    });
  });
});
