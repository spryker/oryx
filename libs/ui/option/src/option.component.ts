import { Icons } from '../../icon';
import { optionStyles } from './option.styles';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

export class OptionComponent extends LitElement {
  static styles = [optionStyles];

  @property() icon?: Icons | string;

  @property({ type: Boolean, reflect: true }) selected?: boolean;

  @property({ type: Boolean, reflect: true }) hide?: boolean;

  render(): TemplateResult {
    return html` ${when(
        !!this.icon,
        () => html`<oryx-icon .type=${this.icon}></oryx-icon>`
      )}
      <slot>${this.value}</slot>
      <oryx-icon class="mark" type="mark"></oryx-icon>`;
  }

  protected _value?: string;

  get value(): string | undefined {
    return this._value ?? this.innerText;
  }

  @property()
  set value(value: string | undefined) {
    this._value = value;
  }
}
