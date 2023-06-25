import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { TextComponent } from './text.component';
import { textComponent } from './text.def';

describe('TextComponent', () => {
  let element: TextComponent;

  beforeAll(async () => {
    await useComponent(textComponent);
  });

  describe('when the component is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-text></oryx-text>`);
    });

    it('should defined', () => {
      expect(element).toBeInstanceOf(TextComponent);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });
});
