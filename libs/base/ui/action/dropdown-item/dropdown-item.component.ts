import { ButtonType } from '@spryker-oryx/ui/button';
import { Icons } from '@spryker-oryx/ui/icon';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { DropdownItemComponentAttributes } from './dropdown-item.model';
import { styles } from './dropdown-item.styles';

@hydrate()
export class DropdownItemComponent
  extends LitElement
  implements DropdownItemComponentAttributes
{
  static styles = styles;

  @property() text?: string;
  @property() url?: string;
  @property() icon?: Icons | string;

  protected override render(): TemplateResult {
    return html`<oryx-button type=${ButtonType.Text}
      >${when(
        this.url,
        () => html`<a href=${this.url}>${this.renderContent()}</a>`,
        () => html`<span>${this.renderContent()}</span>`
      )}
    </oryx-button>`;
  }

  protected renderContent(): TemplateResult {
    return html`${when(
      this.icon,
      () => html`<oryx-icon .type=${this.icon}></oryx-icon>`
    )}${this.text}`;
  }
}
