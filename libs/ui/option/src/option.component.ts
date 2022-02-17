import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { IconType } from '../../icon/';
import { optionStyles } from './option.styles';

export class OptionComponent extends LitElement {
  static styles = [optionStyles];

  @property() icon?: IconType | string;
  @property({ reflect: true }) value?: string;
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  // TODO: this will come back when we introduce the SELECT component
  // TODO: introduce selector const, see https://github.com/spryker/fes/pull/314#discussion_r808822624
  // connectedCallback(): void {
  //   super.connectedCallback();
  //   if (this.parentElement && this.parentElement.tagName === 'ORYX-SELECT') {
  //     this.setAttribute('slot', 'option');
  //   }
  // }

  render(): TemplateResult {
    return html` ${when(
        !!this.icon,
        () => html`<oryx-icon .type=${this.icon}></oryx-icon>`
      )}
      <slot></slot>
      <oryx-icon class="mark" type="mark"></oryx-icon>`;
  }
}
