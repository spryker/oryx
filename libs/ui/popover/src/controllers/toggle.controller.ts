import { LitElement, ReactiveController } from 'lit';
import { getControl } from '../../../input';
import { PopoverComponent } from '../popover.component';
import { MaxHeightController } from './max-height.controller';

function timePassed(start: number, timeGap = 300): boolean {
  const mouseUpStarted = new Date().getTime();
  return mouseUpStarted - start > timeGap;
}

/**
 * Toggles an element when the user uses the keyboard, by toggling the "show" attribute.
 *
 * - Enter / space – toggles the `show` attribute
 * - Escape – removes the `show` attribute
 * - Any key – adds the `show` attribute
 *
 * When the meta key (cmd/ctrl) is used, the 'show' attribute is not toggled.
 *
 * The toggled element can be specified by the `elementSelector`.
 */
export class ToggleController implements ReactiveController {
  /**
   * Indicates that when the element is focussed again, it won't open instantly.
   * This is set to true when the page is blurred so that on refocus of the page
   * a popover won't animate spontaneously on the screen.
   */
  protected skipOpeningOnNextFocus?: boolean;

  protected maxHeightController: MaxHeightController;

  /**
   * Indicates the time that the mouse is pressed
   */
  protected timeStarted = 0;

  hostConnected(): void {
    window.addEventListener('blur', () => {
      this.skipOpeningOnNextFocus = true;
    });

    this.host.addEventListener('focusin', () => this.handleFocusin());
    this.host.addEventListener('focusout', () => this.handleFocusout());
    this.host.addEventListener('mousedown', () => this.handleMousedown());
    this.host.addEventListener('mouseup', () => this.handleMouseup());
    this.host.addEventListener('keydown', (e: KeyboardEvent) =>
      this.handleKeydown(e)
    );
  }

  protected handleFocusin(): void {
    if (!this.skipOpeningOnNextFocus && this.showOnFocus) {
      this.timeStarted = new Date().getTime();
      // if (getControl(this.host)?.value !== '') {
      this.toggle(true);
      // }
    }
    this.skipOpeningOnNextFocus = false;
  }

  protected handleFocusout(): void {
    this.toggle(false);
  }

  protected handleMousedown(): void {
    if (!this.isOpen) {
      this.timeStarted = new Date().getTime();
      this.toggle(true);
    }
  }

  protected handleMouseup(): void {
    if (timePassed(this.timeStarted)) {
      this.toggle(false);
    }
  }

  protected handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter':
      case ' ':
        this.toggle();
        break;
      case 'Escape':
        this.toggle(false);
        break;
      default:
        // avoid toggle the element when the user cmd-tabs away from the browser
        if (!(e.key === 'Meta' && e.metaKey)) {
          this.toggle(true);
        }
    }
  }

  /**
   * Toggles the visibility of the element.
   */
  toggle(force?: boolean): void {
    if (force) {
      this.show();
    } else {
      this.element?.toggleAttribute('show', force);
    }
  }

  protected show(): void {
    if (this.isOpen) {
      return;
    }

    const el = getControl(this.host);
    if (el) {
      this.maxHeightController.setBoundingBox(el);
    }

    this.element?.toggleAttribute('show', true);

    // we need to ensure that the selected element is in the view
    if (this.selected > -1 && this.selected === this.highlighted) {
      setTimeout(() => {
        this.items[this.selected].scrollIntoView({ block: 'nearest' });
      }, 100);
    }
  }

  /**
   * Indicates that the popover element is visible.
   */
  get isOpen(): boolean {
    return !!this.element?.hasAttribute('show');
  }

  protected get selected(): number {
    return this.items.findIndex((item) => item.hasAttribute('selected'));
  }

  protected get highlighted(): number {
    return this.items.findIndex((item) => item.hasAttribute('highlight'));
  }

  protected get element(): PopoverComponent | null {
    return this.host.renderRoot.querySelector(this.elementSelector);
  }

  protected get items(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll(this.itemSelector));
  }

  constructor(
    protected host: LitElement,
    protected elementSelector: string,
    protected itemSelector: string,
    protected showOnFocus = true
  ) {
    this.host.addController(this);
    this.maxHeightController = new MaxHeightController(host);
  }
}
