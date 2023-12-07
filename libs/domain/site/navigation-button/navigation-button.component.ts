import { ContentMixin } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { hydrate } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { NavigationButtonAttributes } from './navigation-button.model';
import { siteNavigationButtonStyles } from './navigation-button.styles';

@hydrate()
export class NavigationButtonComponent extends ContentMixin<NavigationButtonAttributes>(
  LitElement
) {
  static styles = siteNavigationButtonStyles;

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property() url?: string;
  @property() icon?: string;
  @property() text?: string;
  @property() badge?: string;

  protected override render(): TemplateResult {
    return html`
      <oryx-button .href=${this.url}>
        ${when(
          this.icon,
          () => html`<oryx-icon type=${this.icon}></oryx-icon>`
        )}
        ${when(
          this.text,
          () =>
            html`<oryx-heading .tag=${HeadingTag.Subtitle} .maxLines=${1}>
              ${this.text}
            </oryx-heading>`
        )}
        ${when(this.badge, () => html`<mark>${this.badge}</mark>`)}
      </oryx-button>
    `;
  }
}
