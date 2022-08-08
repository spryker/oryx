import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { userAgentSafariMacOsX154 } from '@spryker-oryx/testing';
import { clear, mockUserAgent } from 'jest-useragent-mock';
import { ImageComponent } from './image.component';
import './index';

describe('ImageComponent', () => {
  let element: ImageComponent;

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-image>
        <source srcset="test" />
        <img src="test" />
      </oryx-image>`
    );
  });

  it('should move slotted content to the picture element', async () => {
    const picture = element.renderRoot.querySelector('picture');
    const img = element.renderRoot.querySelector('img');
    const source = element.renderRoot.querySelector('source');

    expect(img?.parentElement).toBe(picture);
    expect(source?.parentElement).toBe(picture);
  });

  describe('when run in Safari browser and image is lazy-loaded', () => {
    beforeEach(async () => {
      mockUserAgent(userAgentSafariMacOsX154);

      element = await fixture(
        html`<oryx-image>
          <source srcset="test" />
          <img src="test" loading="lazy" />
        </oryx-image>`
      );
    });

    afterEach(() => {
      clear();
    });

    it('should remove loading attr', async () => {
      const img = element.renderRoot.querySelector('img');

      expect(img?.hasAttribute('loading')).toBe(false);
    });
  });
});
