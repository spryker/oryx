import { ContentMixin } from '@spryker-oryx/experience';
import { ButtonType } from '@spryker-oryx/ui/button';
import { LitElement, TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import {
  DropdownItemContent,
  DropdownItemOptions,
} from './dropdown-item.model';
import { styles } from './dropdown-item.styles';

export class DropdownItemComponent extends ContentMixin<
  DropdownItemOptions,
  DropdownItemContent
>(LitElement) {
  static styles = styles;

  protected override render(): TemplateResult {
    const { url } = this.$options();
    return html`<oryx-button type=${ButtonType.Text}
      >${when(
        url,
        () => html`<a href=${url}>${this.renderContent()}</a>`,
        () => html`<span>${this.renderContent()}</span>`
      )}
    </oryx-button>`;
  }

  protected renderContent(): TemplateResult {
    const { icon } = this.$options();
    const { text } = this.$content() ?? {};
    return html`${when(
      icon,
      () => html`<oryx-icon type=${icon}></oryx-icon>`
    )}${text}`;
  }
}
