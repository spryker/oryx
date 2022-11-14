// organize-imports-ignore
import {
  nextFrame,
  elementUpdated,
  fixture,
  html,
} from '@open-wc/testing-helpers';
import './ponyfill';
import { wait } from '@spryker-oryx/typescript-utils';
import { useComponent } from '@spryker-oryx/core/utilities';
import { textComponent } from './text.def';
import { TextComponent } from './text.component';

const text = `Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry's standard dummy text ever since the 1500s, when
            an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.`;

describe('TextComponent', () => {
  let element: TextComponent;

  beforeAll(async () => {
    await useComponent(textComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-text');
    expect(el).toBeInstanceOf(TextComponent);
  });

  describe('text truncation', () => {
    describe('when --line-clamp css variable is not set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text>
            <p>${text}</p>
            <p>${text}</p>
          </oryx-text>`
        );
      });
      it('should not set attributes', () => {
        expect(element.hasAttribute('truncation')).toBe(false);
        expect(element.hasAttribute('truncated')).toBe(false);
      });
    });

    describe('when --line-clamp css variable is set', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text .style="${`--line-clamp: 2`}">
            <p>${text}</p>
            <p>${text}</p>
          </oryx-text>`
        );

        //simulate resize
        const textEl = element?.shadowRoot?.querySelector('div') as HTMLElement;

        // JSDOM doesn't support layout
        vi.spyOn(textEl, 'clientHeight', 'get').mockImplementation(() => 24);
        vi.spyOn(textEl, 'scrollHeight', 'get').mockImplementation(() => 100);

        await wait(101);
        await nextFrame();
      });
      it('should set attributes', async () => {
        expect(element.hasAttribute('truncation')).toBe(true);
        expect(element.hasAttribute('truncated')).toBe(true);
      });
      it('should set --lines-count', () => {
        expect(element.style.cssText).toContain('--lines-count');
      });

      describe('when --line-clamp css variable is removed', () => {
        beforeEach(async () => {
          element.style.removeProperty('--line-clamp');

          //simulate resize
          const textEl = element?.shadowRoot?.querySelector(
            'div'
          ) as HTMLElement;

          // JSDOM doesn't support layout
          vi.spyOn(textEl, 'clientHeight', 'get').mockImplementation(() => 20);
          vi.spyOn(textEl, 'scrollHeight', 'get').mockImplementation(() => 80);

          await wait(101);
          await nextFrame();
        });

        it('should remove truncation attribute', async () => {
          expect(element.hasAttribute('truncation')).toBe(false);
        });
      });
    });
  });

  describe('toggling', () => {
    describe('when hideToggle is not specified', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text></oryx-text>`);
      });

      it('should render a toggle button slot', () => {
        expect(element).toContainElement('slot[name="toggle"]');
      });
    });

    describe('when showToggle is specified', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text hideToggle></oryx-text>`);
      });

      it('should render a toggle button slot', () => {
        expect(element).not.toContainElement('slot[name="toggle"]');
      });
    });

    describe('when click on toggle button', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text .style="${`--line-clamp: 2`}">
            <p>${text}</p>
            <p>${text}</p>
          </oryx-text>`
        );

        element.shadowRoot
          ?.querySelector('button')
          ?.dispatchEvent(new Event('click'));
      });

      it('should collapse the text', () => {
        expect(element.hasAttribute('truncated')).toBe(false);
      });

      it('should set initialized attr', () => {
        expect(element.hasAttribute('initialized')).toBe(true);
      });
    });
  });
});
