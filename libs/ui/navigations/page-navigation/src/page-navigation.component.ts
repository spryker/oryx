import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { PageNavigationController } from './page-navigation.controller';
import { PageNavigationProperties } from './page-navigation.model';
import { styles } from './page-navigation.styles';

export class PageNavigationComponent
  extends LitElement
  implements PageNavigationProperties
{
  static styles = styles;
  @property({ type: Boolean }) disableNavigation = false;
  @property() sectionsContainerSelector!: string;

  protected controller = new PageNavigationController(this);

  protected override render(): TemplateResult {
    return html`
      <nav aria-label=${this.ariaLabel}>
        <slot></slot>
      </nav>
    `;
  }
}
