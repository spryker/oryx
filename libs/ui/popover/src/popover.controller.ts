import { getControl } from '../../input';
import { OptionComponent } from '../../option';
import { PopoverComponent } from './popover.component';
import { PopoverOptions, PopoverSelectEvent } from './popover.model';
import { LitElement, ReactiveController } from 'lit';

export const defaultPopoverOptions: PopoverOptions = {
  showOnFocus: true,
  selectable: true,
};

const timePassed = (start: number, timeGap = 300): boolean => {
  const mouseUpStarted = new Date().getTime();
  return mouseUpStarted - start > timeGap;
};

const OUT_OF_INDEX = -1;

export class PopoverController implements ReactiveController {
  /**
   * popover options that control the behaviour of the controller
   */
  public options: PopoverOptions = {};

  /**
   * Indicates the time that the mouse is pressed
   */
  protected timeStarted = 0;

  /**
   * Indicates that when the element is focussed again, it won't open instantly.
   * This is set when the page is blurred, so that on refocus to the page, a popover
   * won't animate spontaneously on the screen.
   */
  protected skipOpeningOnNextFocus?: boolean;

  constructor(protected host: LitElement, options?: PopoverOptions) {
    this.host.addController(this);
    this.options = { ...defaultPopoverOptions, ...options };
  }

  hostConnected(): void {
    window.addEventListener('blur', () => {
      this.skipOpeningOnNextFocus = true;
    });

    this.host.addEventListener('focusin', () => this.handleFocusin());

    this.host.addEventListener('mousedown', () => this.handleMousedown());

    this.host.addEventListener('mouseup', (e: Event) => this.handleMouseup(e));

    this.host.addEventListener('keydown', (e: KeyboardEvent) =>
      this.handleKeydown(e)
    );

    this.host.addEventListener('focusout', () => this.handleFocusout());

    this.host.addEventListener('input', (() => {
      if (getControl(this.host)?.value === '') {
        this.deselect();
      } else {
        this.show();
      }
    }) as EventListener);

    this.host.addEventListener('change', (() => {
      const value = getControl(this.host)?.value;
      this.handleChange(value ?? '');
    }) as EventListener);
  }

  hostUpdated(): void {
    const control = getControl(this.host);
    if (control && control.value !== '') {
      this.handleChange(control.value);
    }
  }

  protected handleFocusin(): void {
    if (!this.skipOpeningOnNextFocus && this.options.showOnFocus) {
      this.timeStarted = new Date().getTime();
      if (getControl(this.host)?.value !== '') {
        this.show();
      }
    }
    this.skipOpeningOnNextFocus = false;
  }

  protected handleMousedown(): void {
    if (!this.isOpen) {
      this.timeStarted = new Date().getTime();
      this.show();
    }
  }

  protected handleMouseup(e: Event): void {
    if (timePassed(this.timeStarted)) {
      this.hide();
      const index = this.items.indexOf(e.target as OptionComponent);
      this.select(index);
    }
  }

  protected handleFocusout(): void {
    this.hide();
  }

  moveHighlight(e: KeyboardEvent, moveBy?: number, fallback = 0): void {
    let highlight = this.highlight;
    if (highlight === OUT_OF_INDEX) {
      highlight = 0;
    }

    if (!this.isOpen && this.selected > OUT_OF_INDEX) {
      highlight = this.selected;
    } else if (this.isOpen) {
      if (moveBy) {
        highlight = this.highlight + moveBy;
      } else {
        highlight = fallback;
      }
    }
    if (highlight < 0 || highlight >= this.items.length) {
      highlight = fallback;
    }
    this.highlight = highlight;
    this.show();
    e.preventDefault();
  }

  protected handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowDown':
        if (e.metaKey) {
          this.moveHighlight(e, 10, this.items.length - 1);
        } else {
          this.moveHighlight(e, 1, 0);
        }
        break;
      case 'PageDown':
        this.moveHighlight(e, 10, this.items.length - 1);
        break;
      case 'End':
        this.moveHighlight(e, undefined, this.items.length - 1);
        break;
      case 'ArrowUp':
        if (e.metaKey) {
          this.moveHighlight(e, -10, 0);
        } else {
          this.moveHighlight(e, -1, this.items.length - 1);
        }
        break;
      case 'PageUp':
        this.moveHighlight(e, -10, 0);
        break;
      case 'Home':
        this.moveHighlight(e);
        break;
      case 'Enter':
        if (this.isOpen) {
          e.stopImmediatePropagation();
          this.select(this.highlight);
        }
        this.toggle();
        break;
      case ' ':
        if (this.isReadonly()) {
          if (this.isOpen) {
            e.stopImmediatePropagation();
            this.select(this.highlight);
          }
          e.preventDefault();
          this.toggle();
        }
        break;
      case 'Escape':
        this.highlight = OUT_OF_INDEX;
        this.hide();
        this.items[0]?.scrollIntoView({ block: 'start' });
        break;
      default:
        // avoid other potential interactions from the key bindings
        // from the host application
        e.stopImmediatePropagation();
    }
  }

  protected isReadonly(): boolean {
    const control = getControl(this.host);
    return (
      !!control && (control instanceof HTMLSelectElement || control.readOnly)
    );
  }

  /**
   * Selects the option based on the value.
   *
   * The options also scrolls into view to ensure it is visible to the user.
   */
  protected handleChange(value: string): void {
    if (this.items) {
      const index = this.items.findIndex((item) => item.value === value);
      this.select(index);
      this.items[index]?.scrollIntoView({ block: 'center' });
    }
  }

  protected get highlight(): number {
    return this.items.findIndex((item) => item.hasAttribute('highlight'));
  }

  protected set highlight(index: number) {
    this.items[this.highlight]?.toggleAttribute('highlight', false);
    const option = this.items[index];
    if (option) {
      option.toggleAttribute('highlight', true);
      // unfortunately no native smooth scrolling
      // (in combination with block scrolling)
      option.scrollIntoView({ block: 'nearest' });

      // in case the popover just opened, we ensure that we do
      // have the option in view
      setTimeout(() => {
        option.scrollIntoView({ block: 'nearest' });
      }, 300);
    }
  }

  protected get selected(): number {
    return this.items.findIndex((item) => item.hasAttribute('selected'));
  }

  protected set selected(index: number) {
    this.items[index]?.toggleAttribute('selected', true);
  }

  protected deselect(): void {
    this.select(OUT_OF_INDEX);
  }

  protected select(index: number | undefined): void {
    if (index === undefined || !this.options.selectable) {
      return;
    }

    if (this.selected === index) {
      return;
    }
    this.items
      .find((item) => item.hasAttribute('selected'))
      ?.removeAttribute('selected');
    const selected = this.items[index];
    this.highlight = index;
    if (selected) {
      this.selected = index;
      const event = new CustomEvent<PopoverSelectEvent>('oryx.select', {
        detail: { selected },
        bubbles: true,
        composed: true,
      });
      this.host.dispatchEvent(event);
    }
  }

  protected get element(): PopoverComponent | null {
    return this.host.renderRoot.querySelector('oryx-popover');
  }

  protected show(): void {
    if (this.element?.hasAttribute('show')) {
      return;
    }
    const maxHeightFallback = 320;
    const margin = 20;
    const maxHeight =
      this.items.length > 0 && this.items.length < 9
        ? this.items.length * 42
        : maxHeightFallback;

    this.host.toggleAttribute(
      'up',
      window.innerHeight - this.host.getBoundingClientRect().bottom <
        maxHeight + margin
    );
    this.element?.toggleAttribute('show', true);

    if (this.selected > OUT_OF_INDEX && this.highlight === this.selected) {
      // we need to ensure that the selected element is in the view
      setTimeout(() => {
        this.items[this.selected]?.scrollIntoView({ block: 'center' });
      }, 300);
    }
  }

  protected hide(): void {
    this.element?.removeAttribute('show');
  }

  protected toggle(): void {
    this.element?.toggleAttribute('show');
  }

  protected get isOpen(): boolean {
    return !!this.element?.hasAttribute('show');
  }

  /**
   * Return an array of available oryx-option elements.
   */
  protected get items(): OptionComponent[] {
    return Array.from(this.host.querySelectorAll('oryx-option:not([hide])'));
  }
}
