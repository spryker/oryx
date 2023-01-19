import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { SwatchAttributes } from './swatch.model';
import { swatchBaseStyle } from './swatch.styles';

export class SwatchComponent extends LitElement implements SwatchAttributes {
  static styles = swatchBaseStyle;

  @property()
  set color(value: string) {
    this.setAttribute('style', `--swatch: ${value}`);
  }
}
