import { hydratable, iconInjectable, Size } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValues, svg, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { IconProperties, Icons } from './icon.model';
import { styles } from './icon.styles';

@hydratable()
export class IconComponent extends LitElement implements IconProperties {
  static styles = styles;

  constructor(protected iconResolver = iconInjectable.get()) {
    super();
  }

  @property({ reflect: true }) type?: Icons | string;
  @property({ reflect: true }) size?: Size;
  @property() sprite?: string;

  @state() protected renderer?: TemplateResult;

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('type')) {
      this.renderer = this.iconResolver?.render(
        this.type as string,
        this.spriteUrl
      );
    }
    super.willUpdate(changedProperties);
  }

  protected override render(): TemplateResult {
    if (this.renderer) return this.renderer;

    if (this.spriteUrl) {
      return svg`
        <svg viewBox="0 0 24 24">
          <use href="${this.spriteUrl}" />
        </svg>
      `;
    }

    return html`<slot></slot>`;
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
  protected get spriteUrl(): string | undefined {
    if (!this.sprite) {
      return;
    }

    return `${this.sprite}#${this.type}`;
  }
}
