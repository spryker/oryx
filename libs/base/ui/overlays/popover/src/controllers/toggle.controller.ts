import { isSafari, nonFocusableOnClickInSafari } from '@spryker-oryx/ui';
import { isFocusable } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { getControl } from '../../../../form/utilities';
import { PopoverComponent } from '../popover.component';
import {
  CLOSE_EVENT,
  CLOSE_POPOVER_ATTR,
  PopoverOptions,
} from '../popover.model';
import { DimensionController } from './dimension.controller';

function timePassed(start: number, timeGap = 300): boolean {
  return Date.now() - start > timeGap;
}

interface ToggleOptions extends PopoverOptions {
  elementSelector: string;
  itemSelector: string;
}

/**
 * Toggles an element when the user uses the keyboard, by toggling the "show" attribute.
 * Also toggles the "open" attribute on the host element.
 *
 * - Enter / space – toggles the `show` attribute
 * - Escape – removes the `show` attribute
 * - Any key – adds the `show` attribute
 *
 * When the meta key (cmd/ctrl) is used, the 'show' attribute is not toggled.
 *
 * The toggled element can be specified by the `elementSelector` option.
 */
export class ToggleController implements ReactiveController {
  /**
   * Indicates that when the element is focussed again, it won't open instantly.
   * This is set to true when the page is blurred so that on refocus of the page
   * a popover won't animate spontaneously on the screen.
   */
  protected skipOpeningOnNextFocus?: boolean;

  protected dimensionController: DimensionController;

  /**
   * Indicates that focusout event was dispatched before focusin
   */
  protected timeStarted = 0;

  /**
   * Indicates that key on keyboard is pressed
   */
  protected keyIsPressed = false;

  /**
   * Until Safari has issue with focusing of some elements during click on them
   * need to remember those elements and make them focused manually
   */
  protected shouldBeFocused: EventTarget | null = null;

  async hostConnected(): Promise<void> {
    window.addEventListener('blur', this.handleBlur);

    this.host.addEventListener(CLOSE_EVENT, this.handleContentCloseEvent);
    this.host.addEventListener('focusin', this.handleFocusin);
    this.host.addEventListener('focusout', this.handleFocusout);
    this.host.addEventListener('mousedown', this.handleMousedown);
    this.host.addEventListener('mouseup', this.handleMouseup);
    this.host.addEventListener('keydown', this.handleKeydown);
    this.host.addEventListener('keyup', this.handleKeyup);

    if (this.host.hasAttribute('open')) {
      //simulate first updated hook
      this.host.requestUpdate();
      await this.host.updateComplete;

      this.setBoundingBox();
    }
  }

  hostDisconnected(): void {
    window.removeEventListener('blur', this.handleBlur);

    this.host.removeEventListener(CLOSE_EVENT, this.handleContentCloseEvent);
    this.host.removeEventListener('focusin', this.handleFocusin);
    this.host.removeEventListener('focusout', this.handleFocusout);
    this.host.removeEventListener('mousedown', this.handleMousedown);
    this.host.removeEventListener('mouseup', this.handleMouseup);
    this.host.removeEventListener('keydown', this.handleKeydown);
    this.host.removeEventListener('keyup', this.handleKeyup);
  }

  protected handleBlur(): void {
    this.skipOpeningOnNextFocus = true;

    if (this.isOpen) {
      this.toggle(false);
    }
  }

  protected handleFocusin(): void {
    if (!this.skipOpeningOnNextFocus && this.options.showOnFocus) {
      this.timeStarted = Date.now();
      this.toggle(true);
    }

    this.skipOpeningOnNextFocus = false;
  }

  protected async handleFocusout(): Promise<void> {
    if (!this.host.matches(':focus-within')) {
      this.toggle(false);
    }

    this.focusShouldBeFocusedMaybe();
  }

  protected handleMousedown(e: MouseEvent): void {
    if (
      !isFocusable(e.target as HTMLElement) &&
      this.emitterIsInsidePopover(e)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (isSafari()) {
      this.shouldBeFocused =
        e.composedPath().find((element) => {
          return nonFocusableOnClickInSafari.some(
            (selector) =>
              element instanceof HTMLElement && element.matches(selector)
          );
        }) ?? null;
    }

    if (!this.isOpen) {
      this.timeStarted = Date.now();
      this.toggle(true);
    }
  }

  protected async handleMouseup(e: MouseEvent): Promise<void> {
    this.focusShouldBeFocusedMaybe();

    const isEmitterOutside =
      timePassed(this.timeStarted) && !this.emitterIsInsidePopover(e);

    if ((await this.shouldClosePopover(e)) || isEmitterOutside) {
      this.toggle(false);
    }
  }

  protected handleKeydown(e: KeyboardEvent): void {
    if (this.keyIsPressed) {
      return;
    }

    this.keyIsPressed = true;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (this.emitterIsInsidePopover(e) && !this.shouldClosePopover(e)) {
          return;
        }

        this.toggle();
        break;
      case 'Escape':
        if (this.isOpen) {
          this.toggle(false);
        }

        break;
      default:
        // avoid toggle the element when the user cmd-tabs away from the browser
        // or dispatching Tab keyhandleMouseup
        if (!((e.key === 'Meta' && e.metaKey) || e.key === 'Tab')) {
          this.toggle(true);
        }
    }
  }

  protected handleKeyup(): void {
    this.keyIsPressed = false;
  }

  /**
   * Handle close event that emitted by content inside element.
   * Doesn't dispatch another one when close
   */
  protected handleContentCloseEvent(e: Event): void {
    const dispatchedByContent = e.target !== this.element;

    if (dispatchedByContent && this.isOpen) {
      this.host.toggleAttribute('open', false);
      this.element?.toggleAttribute('show', false);
    }
  }

  /**
   * Toggles the visibility of the element.
   */
  toggle(force?: boolean): void {
    if (force ?? !this.isOpen) {
      this.show();
    } else {
      this.host.toggleAttribute('open', false);
      this.element?.toggleAttribute('show', false);

      this.element?.dispatchEvent(
        new CustomEvent(CLOSE_EVENT, { composed: true, bubbles: true })
      );
    }
  }

  protected show(): void {
    if (this.isOpen) {
      return;
    }

    this.setBoundingBox();

    this.host.toggleAttribute('open', true);
    this.element?.toggleAttribute('show', true);

    // we need to ensure that the selected element is in the view
    if (this.selected > -1 && this.selected === this.highlighted) {
      setTimeout(() => {
        this.items[this.selected].scrollIntoView({ block: 'nearest' });
      }, 100);
    }
  }

  protected emitterIsInsidePopover(
    e: MouseEvent | KeyboardEvent | Event
  ): boolean {
    return e.composedPath().includes(this.element as HTMLElement);
  }

  protected setBoundingBox(): void {
    this.dimensionController.setBoundingBox(
      this.options.boundingElement ?? getControl(this.host)
    );
  }

  protected shouldClosePopover(e: Event): Promise<boolean> {
    const shouldBeClosed = e
      .composedPath()
      .some(
        (element, i, path) =>
          i <= path.indexOf(this.element as HTMLElement) &&
          element instanceof Element &&
          element.hasAttribute(CLOSE_POPOVER_ATTR)
      );
    //add a delay to allow other click handlers being resolved
    return new Promise((resolve) =>
      setTimeout(() => resolve(shouldBeClosed), 0)
    );
  }

  protected focusShouldBeFocusedMaybe(): void {
    if (this.shouldBeFocused) {
      (this.shouldBeFocused as HTMLElement).focus();
      this.shouldBeFocused = null;
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

  get element(): PopoverComponent | null {
    return this.host.renderRoot.querySelector(this.options.elementSelector);
  }

  protected get items(): HTMLElement[] {
    return Array.from(this.host.querySelectorAll(this.options.itemSelector));
  }

  constructor(protected host: LitElement, protected options: ToggleOptions) {
    this.host.addController(this);
    this.dimensionController = new DimensionController(host);

    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocusin = this.handleFocusin.bind(this);
    this.handleFocusout = this.handleFocusout.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.handleContentCloseEvent = this.handleContentCloseEvent.bind(this);
  }
}
