import { LitElement, ReactiveController } from 'lit';
import { CLOSE_EVENT } from '../popover.model';

const OUT_OF_INDEX = -1;

/**
 * Toggles the highlight attribute on a list of items for keyboard users.
 * The arrow down/up, page down/up, home/end the highlight moves the highlight
 * up or down.
 *
 * - arrow up/down: move one up/down. Moves to top/bottom when end of list is reached.
 * - arrow up/down + meta key: move 10 up/down
 * - page up/down: move 10 up/down
 * - home: move to top
 * - end: move to bottom
 *
 * The `highlight` attribute is applied to the item and can further be used in CSS.
 *
 * ```html
 * <item>first</item>
 * <item highlight>second</item>
 * <item>third</item>
 * ```
 *
 * The items are configurable by the `listItemsSelector`.
 */
export class HighlightController implements ReactiveController {
  hostConnected(): void {
    this.host.addEventListener('keydown', this.handleKeydown);
    this.host.addEventListener(CLOSE_EVENT, this.clear);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('keydown', this.handleKeydown);
    this.host.removeEventListener(CLOSE_EVENT, this.clear);
  }

  clear(): void {
    this.highlight = OUT_OF_INDEX;
  }

  get highlight(): number {
    return this.items.findIndex((item) => item.hasAttribute('highlight'));
  }

  set highlight(index: number) {
    this.items[this.highlight]?.toggleAttribute('highlight', false);
    const option = this.items[index];
    if (option) {
      option.toggleAttribute('highlight', true);

      // unfortunately no native smooth scrolling for block scrolling
      option.scrollIntoView({ block: 'nearest' });

      // ensures that the element becomes visible after animation time
      setTimeout(() => {
        option.scrollIntoView({ block: 'nearest' });
      }, 300);
    }
  }

  protected handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowUp':
        if (e.metaKey) this.move(e, -10, 0);
        else this.move(e, -1, this.items.length - 1);

        break;
      case 'ArrowDown':
        if (e.metaKey) this.move(e, 10, this.items.length - 1);
        else this.move(e, 1, 0);

        break;
      case 'PageUp':
        this.move(e, -10, 0);
        break;
      case 'PageDown':
        this.move(e, 10, this.items.length - 1);
        break;
      case 'Home':
        this.move(e);
        break;
      case 'End':
        this.move(e, undefined, this.items.length - 1);
        break;
    }
  }

  protected move(e: KeyboardEvent, moveBy?: number, fallback = 0): void {
    e.preventDefault();

    if (this.highlight === OUT_OF_INDEX) this.highlight = this.selected;

    let highlight = this.highlight;

    if (moveBy) highlight = this.highlight + moveBy;
    else highlight = fallback;

    if (highlight < 0 || highlight >= this.items.length) highlight = fallback;

    this.highlight = highlight;
  }

  protected get selected(): number {
    return this.items.findIndex((item) => item.hasAttribute('selected'));
  }

  protected get items(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll(this.listItemsSelector));
  }

  constructor(protected host: LitElement, protected listItemsSelector: string) {
    this.host.addController(this);

    this.handleKeydown = this.handleKeydown.bind(this);
    this.clear = this.clear.bind(this);
  }
}
