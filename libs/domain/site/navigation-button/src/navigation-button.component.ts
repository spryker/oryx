import { HeadingTag } from '@spryker-oryx/ui/heading';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { NavigationButtonAttributes } from './navigation-button.model';
import { styles } from './navigation-button.styles';

export class NavigationButtonComponent
  extends LitElement
  implements NavigationButtonAttributes
{
  static styles = styles;

  @property() url?: string;
  @property() icon?: string;
  @property() text?: string;
  @property() badge?: string;

  protected override render(): TemplateResult {
    const innerContent = html`
      <oryx-icon type=${ifDefined(this.icon)}></oryx-icon>
      <oryx-heading tag=${HeadingTag.Subtitle} .maxLines=${1}>
        <slot name="text">${this.text}</slot>
      </oryx-heading>
      ${when(this.badge, () => html`<mark>${this.badge}</mark>`)}
    `;

    return html`
      <oryx-button>
        ${when(
          this.url,
          () => html`<a href=${this.url!}>${innerContent}</a>`,
          () => html`<button>${innerContent}</button>`
        )}
      </oryx-button>
    `;
  }
}
