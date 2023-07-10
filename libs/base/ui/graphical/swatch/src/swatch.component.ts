import { AlertType } from '@spryker-oryx/ui';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SwatchAttributes } from './swatch.model';
import { swatchBaseStyle } from './swatch.styles';

export class SwatchComponent extends LitElement implements SwatchAttributes {
  static styles = swatchBaseStyle;

  @property()
  set type(value: AlertType) {
    const color = `var(--oryx-color-${value}-9)`;
    this.color = color;
  }

  @property()
  set color(value: string) {
    this.setAttribute('style', `--swatch: ${value}`);
  }
}
