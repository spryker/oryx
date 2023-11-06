import { queryAssignedElements } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';

const focusableSelectors = [
  'a[href]',
  'button',
  '[tabindex]',
  'input',
  'select',
  'textarea',
];

export class VisibleFocusController implements ReactiveController {
  protected mouseWasUsed?: boolean;

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }

  hostConnected(): void {
    this.setupVisibleFocusHandlers();
  }

  /**
   * Manage the visible focus. While there's good browser support these days for
   * visible focus, visible focus does not work in conjunction with `:focus-within`
   * selectors. We therefore maintain a visible-focus attribute at the host.
   */
  protected setupVisibleFocusHandlers(): void {
    const onBlur = (): void => {
      this.mouseWasUsed = undefined;
      this.host.removeAttribute('visible-focus');
      this.focusableElements().forEach((el) => {
        el.removeEventListener('blur', onBlur);
      });
    };

    this.host.addEventListener('mousedown', () => {
      this.mouseWasUsed = true;
      this.host.removeAttribute('visible-focus');
      this.focusableElements().forEach((el) => {
        el.addEventListener('blur', () => onBlur());
      });
    });

    this.host.addEventListener('keyup', () => {
      if (!this.mouseWasUsed) {
        this.host.toggleAttribute('visible-focus', true);
      }

      this.focusableElements().forEach((el) => {
        el.addEventListener('blur', () => onBlur());
      });
    });
  }

  protected focusableElements(): HTMLElement[] {
    return queryAssignedElements(this.host, {
      selector: focusableSelectors.join(','),
      flatten: true,
    }) as HTMLElement[];
  }
}
