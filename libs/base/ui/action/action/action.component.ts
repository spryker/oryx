import { Icons, IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { ColorType } from '../link';
import {
  ActionComponentAttributes,
  ActionSize,
  ActionType,
} from './action.model';
import { actionStyles } from './action.styles';
import { ColorController } from './color.controller';

@ssrShim('style')
@hydrate()
export class ActionComponent
  extends LitElement
  implements ActionComponentAttributes
{
  static styles = actionStyles;

  protected colorController = new ColorController(this);

  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property() text?: string;
  @property() label?: string;
  @property() icon?: Icons | string;
  @property() href?: string;
  @property() mark?: string;

  @property({ reflect: true }) type?: ActionType;
  @property({ reflect: true }) size?: ActionSize;
  @property({ reflect: true }) color?: ColorType;

  @property({ type: Boolean, reflect: true }) active?: boolean;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Boolean, reflect: true }) loading?: boolean;
  @property({ type: Boolean, reflect: true }) confirmed?: boolean;

  protected willUpdate(props: PropertyValues): void {
    super.willUpdate(props);
    this.colorController.updateColors();
    //     this.setAttributes();
  }

  protected override render(): TemplateResult {
    // const templates = [this.renderLoader(), this.renderConfirmed()];

    const button = this.href ? this.renderLink() : this.renderButton();
    if (this.text || this.icon) {
      return button;
    } else {
      return html`<slot name="custom">${button}</slot>`;
    }

    // return html` ${templates} `;
  }

  //   ${preHydrate(hydrateSlotChange, this.tagName.toLowerCase())}

  protected renderButton(): TemplateResult {
    return html`
      <button
        part="button"
        type="button"
        ?disabled=${this.disabled}
        aria-label=${ifDefined(this.label ?? this.text)}
      >
        ${this.renderContent()}
      </button>
    `;
  }

  protected renderLink(): TemplateResult {
    return html`
      <a
        part="button"
        href=${this.href}
        aria-label=${ifDefined(this.label ?? this.text)}
      >
        ${this.renderContent()}
      </a>
    `;
  }

  protected renderContent(): TemplateResult {
    return html`${[
        this.renderIcon(),
        this.renderLoader(),
        this.renderConfirmed(),
        this.renderMarker(),
      ]}
      <slot @slotchange=${() => this.onSlotChange()}>
        ${when(this.type !== ActionType.Icon, () => html`${this.text}`)}
      </slot>`;
  }

  protected onSlotChange(): void {
    this.setAttributes();
  }

  /**
   * There's no point in setting has-text when has-icon is false.
   */
  protected setAttributes(): void {
    const hasIcon = !!(this.icon || this.querySelector?.('oryx-icon'));
    this.toggleAttribute('has-icon', hasIcon);
    if (hasIcon) {
      this.toggleAttribute(
        'has-text',
        !!(this.text || this.textContent?.trim())
      );
    }
    this.toggleAttribute(
      'inert',
      !!(this.loading || this.confirmed || this.disabled)
    );
  }

  protected renderIcon(): TemplateResult | void {
    if (!this.icon) return;
    return html`<oryx-icon .type=${this.icon}></oryx-icon>`;
  }

  /**
   * The loader icon will be rendered when the component is not disabled.
   */
  protected renderLoader(): TemplateResult | void {
    if (!this.loading || this.disabled) return;
    return html`<oryx-icon loader .type=${IconTypes.Loader}></oryx-icon>`;
  }

  /**
   * The loader icon will be rendered when the component state is not disabled nor loading
   */
  protected renderConfirmed(): TemplateResult | void {
    if (!this.confirmed || this.disabled || this.loading) return;
    return html`<oryx-icon confirmed .type=${IconTypes.Check}></oryx-icon>`;
  }

  protected renderMarker(): TemplateResult | void {
    if (this.mark) return html`<mark>${this.mark}</mark>`;
  }
}
