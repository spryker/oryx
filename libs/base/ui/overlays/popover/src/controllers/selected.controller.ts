import { LitElement, ReactiveController } from 'lit';
import { PopoverSelectEvent } from '../popover.model';

/**
 * Toggles the `selected` attribute on a list of item. The `highlight` attribute
 * is applied to the item and can further be used in CSS.
 *
 * ```html
 * <item>first</item>
 * <item selected>second</item>
 * <item>third</item>
 * ```
 *
 * The items are configurable by the `listItemsSelector`.
 */
export class SelectedController implements ReactiveController {
  hostConnected(): void {
    this.host.addEventListener('mouseup', this.handleMouseup);
  }

  hostDisconnected(): void {
    this.host.removeEventListener('mouseup', this.handleMouseup);
  }

  deselect(): void {
    this.select(-1);
  }

  select(index: number, omitDispatchEvent?: boolean): void {
    if (this.selected === index) {
      return;
    }

    this.items
      .find((item) => item.hasAttribute('active'))
      ?.removeAttribute('active');
    const selected = this.items[index];

    if (selected) {
      this.selected = index;
      if (!omitDispatchEvent) {
        const event = new CustomEvent<PopoverSelectEvent>('oryx.select', {
          detail: { selected },
          bubbles: true,
          composed: true,
        });
        this.host.dispatchEvent(event);
      }
    }
  }

  protected handleMouseup(e: Event): void {
    const index = this.items.indexOf(e.target as HTMLElement);
    if (index > -1) {
      this.select(index);
    }
  }

  protected get selected(): number {
    return this.items.findIndex((item) => item.hasAttribute('active'));
  }

  protected set selected(index: number) {
    this.items[index].toggleAttribute('active', true);
  }

  protected get items(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll(this.listItemsSelector));
  }

  constructor(protected host: LitElement, protected listItemsSelector: string) {
    this.host.addController(this);

    this.handleMouseup = this.handleMouseup.bind(this);
  }
}
