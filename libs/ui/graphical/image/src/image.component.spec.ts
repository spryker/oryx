import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
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
});
