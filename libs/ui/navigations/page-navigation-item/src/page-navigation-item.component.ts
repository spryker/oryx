import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { PageNavigationItemProps } from './page-navigation-item.model';
import { styles } from './page-navigation-item.styles';

export class PageNavigationItemComponent
  extends LitElement
  implements PageNavigationItemProps
{
  static styles = styles;

  @property({ reflect: true, type: Boolean }) active = false;
  @property() targetId!: string;

  protected override render(): TemplateResult {
    return html`
      <h5><slot></slot></h5>
      <slot name="content"></slot>
    `;
  }
}
