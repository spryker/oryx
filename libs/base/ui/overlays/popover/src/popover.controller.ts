import { OptionComponent } from '@spryker-oryx/ui/option';
import { featureVersion } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import {
  HighlightController,
  SelectedController,
  ToggleController,
} from './controllers';
import {
  POPOVER_EVENT,
  PopoverOptions,
  PopoverSelectEvent,
} from './popover.model';
import { TAG_NAME } from './tag';

/**
 * Controls the popover behavior by mouse and keyboard:
 * - toggle the popover (delegated to `ToggleController`)
 * - highlight the popover by keyboard (delegated to `HighlightController`)
 * - select the highlighted iem by keyboard (delegated to `SelectedController`)
 *
 * The PopoverController is not added to the popover component (as you might assume),
 * but can be used by a component that hosts a popover. The reason for this is that
 * the host element is key to the functionality, as this element is responsible for
 * toggling the popover.
 */
export class PopoverController implements ReactiveController {
  protected toggleController: ToggleController;
  protected highlightController: HighlightController;
  protected selectedController: SelectedController;

  protected popoverSelector = TAG_NAME;
  protected optionsSelector = 'oryx-option:not([hide])';

  hostConnected(): void {
    this.host.addEventListener('keydown', this.handleKeydown);
    this.host.addEventListener('input', this.handleInput as EventListener);
    this.host.addEventListener(
      POPOVER_EVENT,
      this.handleSelectEvent as EventListener
    );
  }

  hostDisconnected(): void {
    this.host.removeEventListener('keydown', this.handleKeydown);
    this.host.removeEventListener('input', this.handleInput as EventListener);
    this.host.removeEventListener(
      POPOVER_EVENT,
      this.handleSelectEvent as EventListener
    );
  }

  selectByValue(value: string, omitDispatchEvent?: boolean): void {
    const index = this.items.findIndex((item) => item.value === value);
    this.selectedController.select(index, omitDispatchEvent);
    if (this.toggleController.isOpen) {
      this.items[index]?.scrollIntoView({ block: 'nearest' });
    }
  }

  protected handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter':
        if (this.toggleController.isOpen) {
          this.selectedController.select(this.highlightController.highlight);
        }
        break;
      case ' ':
        if (e.target instanceof HTMLElement && this.isReadonly(e.target)) {
          if (this.toggleController.isOpen) {
            this.selectedController.select(this.highlightController.highlight);
          }
          e.preventDefault();
        }
        break;
    }
  }

  protected handleInput(e: InputEvent): void {
    if (!e.inputType) {
      return;
    }
    const composedTarget = e.composedPath()[0];
    if (
      (e.target as HTMLInputElement | HTMLSelectElement)?.value ||
      (composedTarget instanceof HTMLInputElement && composedTarget?.value)
    ) {
      this.toggleController.toggle(true);
    } else {
      this.selectedController.deselect();
    }
  }

  protected handleSelectEvent(e: CustomEvent<PopoverSelectEvent>): void {
    if (e.detail.selected) {
      const itemIndex = this.items.findIndex(
        (item) => item === e.detail.selected
      );
      this.selectedController.select(itemIndex);
    } else {
      this.selectedController.deselect();
    }
  }

  protected isReadonly(target: HTMLElement): boolean {
    return (
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLInputElement && target.readOnly)
    );
  }

  protected get items(): OptionComponent[] {
    return Array.from(
      this.host.querySelectorAll<OptionComponent>(this.optionsSelector)
    );
  }

  constructor(
    protected host: LitElement & { openOnHover?: boolean },
    protected options?: PopoverOptions
  ) {
    this.host.addController(this);
    this.toggleController = new ToggleController(host, {
      elementSelector: this.popoverSelector,
      itemSelector: this.optionsSelector,
      ...(featureVersion >= '1.4' ? {} : { showOnFocus: true }),
      ...options,
    });
    this.highlightController = new HighlightController(
      host,
      this.optionsSelector
    );
    this.selectedController = new SelectedController(
      host,
      this.optionsSelector
    );

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleSelectEvent = this.handleSelectEvent.bind(this);
  }
}
