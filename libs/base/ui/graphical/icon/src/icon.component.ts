import {
  computed,
  hydrate,
  iconInjectable,
  signalAware,
  signalProperty,
  Size,
  ssrShim,
} from '@spryker-oryx/utilities';
import { html, LitElement, svg, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { IconProperties, Icons } from './icon.model';
import { styles } from './icon.styles';

@ssrShim('style')
@signalAware()
@hydrate()
export class IconComponent extends LitElement implements IconProperties {
  static styles = styles;

  constructor(protected iconResolver = iconInjectable.get()) {
    super();
  }

  @signalProperty({ reflect: true }) type?: Icons | string;
  @property({ reflect: true }) size?: Size;
  @property() sprite?: string;
  @property({ reflect: true, type: Boolean }) direction?: boolean;

  protected renderer = computed(() =>
    this.iconResolver?.render(this.type as string, this)
  );

  protected override render(): TemplateResult {
    const renderResult = this.renderer();

    this.direction = this.hasDirectionExpression();

    if (renderResult) return html`${renderResult}`;

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
   * Returns true if the icon expresses direction, e.g. an arrow icon.
   *
   * TODO: resolve icon config, and set direction based on the icon type
   */
  protected hasDirectionExpression(): boolean {
    return (
      !!this.type &&
      (this.type.includes('arrow') ||
        this.type.includes('right') ||
        this.type.includes('left') ||
        this.type.includes('next') ||
        this.type.includes('previous') ||
        ['local_shipping'].includes(this.type))
    );
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
