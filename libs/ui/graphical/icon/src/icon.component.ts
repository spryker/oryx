import { hook, IconHookToken } from '@spryker-oryx/typescript-utils';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Size } from '../../../utilities';
import { IconProperties, Icons } from './icon.model';
import { styles } from './icon.styles';

const DEFAULT_SPRITE = '/assets/icons.svg';

export class IconComponent extends LitElement implements IconProperties {
  static styles = styles;

  @hook(IconHookToken)
  static renderIcon: IconHookToken = (
    type?: string,
    spriteUrl = ''
  ): TemplateResult => html`
    <svg viewBox="0 0 24 24">
      <use href="${spriteUrl}" />
    </svg>
  `;

  @property({ reflect: true }) type?: Icons | string;
  @property({ reflect: true }) size?: Size;
  @property() sprite?: string;

  render(): TemplateResult {
    return html`
      <slot>
        ${when(this.type, () =>
          IconComponent.renderIcon(this.type as string, this.spriteUrl)
        )}
      </slot>
    `;
  }

  /**
   * Creates the SVG (sprite) url based on the given sprite and icon.
   * The resulting SVG url uses the following format:
   *
   * ```html
   * <use href="/assets/icons.svg#iconType" />
   * ```
   *
   * Defaults to use '/assets/icons.svg'.
   */
  protected get spriteUrl(): string {
    let url = '';
    url += this.sprite ?? DEFAULT_SPRITE;
    url += `#${this.type}`;
    return url;
  }
}
