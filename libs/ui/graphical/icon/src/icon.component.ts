import { iconInjectable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Size } from '../../../utilities';
import { IconProperties, Icons } from './icon.model';
import { styles } from './icon.styles';

const DEFAULT_SPRITE = '/assets/icons.svg';

export class IconComponent extends LitElement implements IconProperties {
  static styles = styles;

  constructor(protected renderIcon = iconInjectable.get()) {
    super();
  }

  @property({ reflect: true }) type?: Icons | string;
  @property({ reflect: true }) size?: Size;
  @property() sprite?: string;

  render(): TemplateResult {
    return html`
      <slot>
        ${when(this.type, () =>
          this.renderIcon.render(this.type as string, this.spriteUrl)
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
    return `${this.sprite ?? DEFAULT_SPRITE}#${this.type}`;
  }
}
