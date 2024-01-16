import { LitElement, ReactiveController } from 'lit';
import { ColorType } from '../link';

export class ColorController implements ReactiveController {
  hostConnected?(): void;

  updateColors(): void {
    if (this.host.alert) {
      this.host.style.setProperty(
        `--oryx-color-primary-0`,
        `var(--oryx-color-error-0, white)`
      );
      for (let i = 1; i <= 12; i++) {
        this.host.style.setProperty(
          `--oryx-color-primary-${i}`,
          `var(--oryx-color-error-${i})`
        );
      }
    }

    const color = this.host.color;
    if (!color || color === 'primary') return;
    for (let i = 1; i <= 12; i++) {
      this.host.style.setProperty(
        `--_c${i}`,
        `var(--oryx-color-${color}-${i})`
      );
    }
    this.host.style.setProperty(`--_c0`, `var(--oryx-color-${color}-0, white)`);
  }

  constructor(
    protected host: LitElement & { alert?: boolean; color?: ColorType }
  ) {
    this.host.addController(this);
  }
}
