import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { a11yConfig } from '@spryker-oryx/typescript-utils';
import { PopoverComponent } from '.';
import './index';

describe('PopoverComponent', () => {
  let element: PopoverComponent;

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
