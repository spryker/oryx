import { ContentMixin } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { NavigationButtonAttributes } from './navigation-button.model';
import { styles } from './navigation-button.styles';

export class NavigationButtonComponent extends ContentMixin<NavigationButtonAttributes>(
  LitElement
) {
  static styles = styles;

  @property() url?: string;
  @property() icon?: string;
  @property() text?: string;
  @property() badge?: string;

  protected override render(): TemplateResult {
    const innerContent = html`
      ${when(this.icon, () => html`<oryx-icon type=${this.icon}></oryx-icon>`)}
      ${when(
        this.text,
        () =>
          html`<oryx-heading tag=${HeadingTag.Subtitle} .maxLines=${1}
            >${this.text}</oryx-heading
          >`
      )}
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
