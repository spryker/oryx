import { LitElement, ReactiveController } from 'lit';
import { getControl } from '../../input';
import { OptionComponent } from '../../option';
import { HighlightController } from './controllers/highlight.controller';
import { SelectedController } from './controllers/selected.controller';
import { ToggleController } from './controllers/toggle.controller';
import { PopoverOptions } from './popover.model';

/**
 * Controls the popover behaviour by mouse and keyboard:
 * - toggle the popover (delegated to `ToggleController`)
 * - highlight the popover by keyboard (delegated to `HighlightController`)
 * - select the highlighted iem by keyboard (delegated to `SelectedController`)
 *
 * The PopoverController is not added to the popover component (as you might assume),
 * but must be added to the component that hosts a popover. The reason for this is that
 * the host element is key to the functionality.
 */
export class PopoverController implements ReactiveController {
  protected toggleController: ToggleController;
  protected highlightController: HighlightController;
  protected selectedController: SelectedController;

  protected popoverSelector = 'oryx-popover';
  protected optionsSelector = 'oryx-option:not([hide])';

  hostConnected(): void {
    this.host.addEventListener('keydown', (e: KeyboardEvent) =>
      this.handleKeydown(e)
    );

    this.host.addEventListener('input', (e) => this.handleInput(e));
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

  protected handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'Enter':
        if (this.toggleController.isOpen) {
          this.selectedController.select(this.highlightController.highlight);
        }
        break;
      case ' ':
        if (this.isReadonly()) {
          if (this.toggleController.isOpen) {
            this.selectedController.select(this.highlightController.highlight);
          }
          e.preventDefault();
        }
        break;
    }
  }

  protected handleInput(e: Event): void {
    if ((e.target as HTMLInputElement | HTMLSelectElement).value) {
      this.toggleController.toggle(true);
    } else {
      this.selectedController.deselect();
    }
  }

  protected handleChange(value: string): void {
    const index = this.items.findIndex((item) => item.value === value);
    this.selectedController.select(index);
    this.items[index]?.scrollIntoView({ block: 'nearest' });
  }

  protected isReadonly(): boolean {
    const control = getControl(this.host);
    return (
      !!control && (control instanceof HTMLSelectElement || control.readOnly)
    );
  }

  protected get items(): OptionComponent[] {
    return Array.from(
      this.host.querySelectorAll<OptionComponent>(this.optionsSelector)
    );
  }

  constructor(protected host: LitElement, protected options?: PopoverOptions) {
    this.host.addController(this);
    this.toggleController = new ToggleController(
      host,
      this.popoverSelector,
      this.optionsSelector,
      this.options?.showOnFocus ?? true
    );
    this.highlightController = new HighlightController(
      host,
      this.optionsSelector
    );
    this.selectedController = new SelectedController(
      host,
      this.optionsSelector
    );
  }
}
