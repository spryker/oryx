import { hydratable, iconInjectable } from '@spryker-oryx/utilities';
import { html, LitElement, svg, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { Size } from '../../../src/utilities';
import { IconProperties, Icons } from './icon.model';
import { styles } from './icon.styles';

const DEFAULT_SPRITE = '/assets/icons.svg';

@hydratable('window:load')
export class IconComponent extends LitElement implements IconProperties {
  static styles = styles;

  constructor(protected iconResolver = iconInjectable.get()) {
    super();
  }

  @property({ reflect: true }) type?: Icons | string;
  @property({ reflect: true }) size?: Size;
  @property() sprite?: string;

  render(): TemplateResult {
    const customRender = this.iconResolver?.render(
      this.type as string,
      this.spriteUrl
    );

    return html`
      <slot>
        ${when(this.type, () =>
          customRender
            ? customRender
            : svg`
                <svg viewBox="0 0 24 24">
                  <use href="${this.spriteUrl}" />
                </svg>
              `
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
