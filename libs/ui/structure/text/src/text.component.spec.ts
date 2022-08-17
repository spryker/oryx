// organize-imports-ignore
import { fixture, html } from '@open-wc/testing-helpers';
import './ponyfill';
import { useComponent } from '@spryker-oryx/core/utilities';
import { textComponent } from './component';
import { TextComponent } from './text.component';

useComponent(textComponent);

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

  describe('truncateAfter', () => {
    describe('when truncateAfter is not defined', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text>
            <p>${text}</p>
            <p>${text}</p>
          </oryx-text>`
        );
      });
      it('should not be truncated', () => {
        expect(element?.hasAttribute('truncate')).toBe(false);
      });
      it('should not have a line-clamp variable', () => {
        expect(element?.style.getPropertyValue('--line-clamp')).toBe('');
      });
      it('should not have a toggle button', () => {
        expect(
          element?.shadowRoot?.querySelector('slot[name="toggle"]')
        ).toBeNull();
      });
    });

    describe('when truncateAfter is larger then 0', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text truncateAfter="3">
            <p>${text}</p>
            <p>${text}</p>
          </oryx-text>`
        );
      });
      it('should be truncated', async () => {
        expect(element?.hasAttribute('truncate')).toBe(true);
      });
      it('should have a line-clamp variable', () => {
        expect(element?.style.getPropertyValue('--line-clamp')).toBe('3');
      });
    });
  });

  describe('toggle', () => {
    describe('when showToggle is not specified', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text></oryx-text>`);
      });
      it('should not render a toggle button slot', () => {
        expect(
          element?.shadowRoot?.querySelector('slot[name="toggle"]')
        ).toBeNull();
      });
    });

    describe('when showToggle is specified', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text showToggle></oryx-text>`);
      });
      it('should render the toggle button slot', () => {
        expect(
          element?.shadowRoot?.querySelector('slot[name="toggle"]')
        ).toBeDefined();
      });
    });

    describe('when text is truncated', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text truncateAfter="3" showToggle>
            <p>${text}</p>
            <p>${text}</p>
          </oryx-text>`
        );
        const textEl = element?.shadowRoot?.querySelector(
          '.text'
        ) as HTMLElement;

        // JSDOM doesn't support layout
        vi.spyOn(textEl, 'clientHeight', 'get').mockImplementation(() => 90);
        vi.spyOn(textEl, 'scrollHeight', 'get').mockImplementation(() => 100);
      });

      describe('and the toggle button is clicked', () => {
        beforeEach(async () => {
          element.shadowRoot
            ?.querySelector('button')
            ?.dispatchEvent(new Event('click'));
        });
        it('should collapse', () => {
          expect(element.hasAttribute('truncate')).toBe(false);
        });
      });
    });
  });
});
