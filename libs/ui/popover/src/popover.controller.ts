import { LitElement, ReactiveController } from 'lit';
import { getControl } from '../../input';
import { OptionComponent } from '../../option';
import { PopoverComponent } from './popover.component';
import { PopoverOptions, PopoverSelectEvent } from './popover.model';

export const defaultPopoverOptions: PopoverOptions = {
  showOnFocus: true,
  selectable: true,
};

const timePassed = (start: number, timeGap = 300): boolean => {
  const mouseUpStarted = new Date().getTime();
  return mouseUpStarted - start > timeGap;
};

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

    this.host.addEventListener('focusin', (e: Event) => {
      this.handleFocusin(e);
    });

    this.host.addEventListener('mousedown', (e: MouseEvent) => {
      this.handleMousedown(e);
    });

    this.host.addEventListener('mouseup', (e: MouseEvent) => {
      this.handleMouseup(e);
    });

    this.host.addEventListener('keydown', (e: KeyboardEvent) => {
      this.handleKeydown(e);
    });

    this.host.addEventListener('focusout', (e: Event) => {
      this.handleFocusout(e);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.host.addEventListener('input', ((e: InputEvent) => {
      this.show();
    }) as EventListener);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.host.addEventListener('change', ((e: Event) => {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleFocusin(e: Event): void {
    if (!this.skipOpeningOnNextFocus && this.options.showOnFocus) {
      this.timeStarted = new Date().getTime();
      this.show();
    }
    this.skipOpeningOnNextFocus = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleMousedown(e: MouseEvent): void {
    if (!this.isOpen) {
      this.timeStarted = new Date().getTime();
      this.show();
    }
  }

  protected handleMouseup(e: MouseEvent): void {
    if (timePassed(this.timeStarted)) {
      this.hide();
      const index = this.items.indexOf(e.target as OptionComponent);
      this.select(index);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleFocusout(e: Event): void {
    this.hide();
  }

  protected handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'ArrowDown':
        if (!this.isOpen && this.selected > -1) {
          this.highlight = this.selected;
        } else if (this.isOpen) {
          this.highlight++;
        }
        this.show();
        if (this.highlight === -1 || this.highlight > this.items.length - 1) {
          this.highlight = 0;
        }
        e.preventDefault();
        break;
      case 'ArrowUp':
        if (!this.isOpen && this.selected > -1) {
          this.highlight = this.selected;
        } else if (this.isOpen) {
          this.highlight--;
        }
        this.show();
        if (this.highlight < 0) {
          this.highlight = this.items.length - 1;
        }
        e.preventDefault();
        break;
      case 'Enter':
      case ' ':
        if (this.isOpen) {
          e.stopImmediatePropagation();
          this.select(this.highlight);
        }
        this.toggle();
        break;
      case 'Escape':
        this.hide();
        break;
      default:
        // avoid other potential interactions from the key bindings
        // from the host application
        e.stopImmediatePropagation();
    }
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
    }
  }

  protected get selected(): number {
    return this.items.findIndex((item) => item.hasAttribute('selected'));
  }

  protected set selected(index: number) {
    this.items[index]?.toggleAttribute('selected', true);
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

    if (this.selected > -1 && this.highlight === this.selected) {
      // we need to ensure that the selected element is in the view
      setTimeout(() => {
        this.items[this.selected].scrollIntoView({ block: 'center' });
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
    return Array.from(this.host.querySelectorAll('oryx-option'));
  }
}
