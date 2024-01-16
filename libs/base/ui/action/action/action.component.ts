import { Icons, IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  ActionComponentAttributes,
  ActionSize,
  ActionState,
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

  @property({ reflect: true }) type?: ActionType;
  /**
   * @default `undefined`
   */
  @property({ type: Boolean, reflect: true }) cta?: boolean;

  @property() text?: string;
  @property() label?: string;
  @property() icon?: Icons | string;
  @property() iconAfter?: Icons | string;
  // @property({ reflect: true }) iconPosition?: 'before' | 'after';
  @property() href?: string;
  @property() mark?: string;

  @property({ reflect: true }) state?: ActionState;
  @property({ reflect: true }) size?: ActionSize;

  @property({ type: Boolean }) alert?: boolean;
  @property({ type: Boolean }) block?: boolean;
  // @property({ type: Boolean }) disabled?: boolean;
  // @property({ type: Boolean, reflect: true }) active?: boolean;
  // @property({ type: Boolean, reflect: true }) loading?: boolean;
  // @property({ type: Boolean, reflect: true }) confirmed?: boolean;

  protected willUpdate(props: PropertyValues): void {
    super.willUpdate(props);
    this.colorController.updateColors();
    //     this.setAttributes();
  }

  protected override render(): TemplateResult {
    // const templates = [this.renderLoader(), this.renderConfirmed()];

    const action = this.href ? this.renderLink() : this.renderButton();
    if (this.text || this.icon) {
      return action;
    } else {
      return html`${action}`;
    }

    // return html` ${templates} `;
  }

  //   ${preHydrate(hydrateSlotChange, this.tagName.toLowerCase())}

  protected renderButton(): TemplateResult {
    return html`
      <button
        type="button"
        ?disabled=${this.state === ActionState.Disabled}
        ?inert=${this.state === ActionState.Disabled}
        aria-label=${ifDefined(this.label ?? this.text)}
        ?iconOnly=${this.icon && !this.text}
      >
        ${this.renderContent()}
      </button>
    `;
  }

  protected renderLink(): TemplateResult {
    return html`
      <a
        href=${this.href}
        aria-label=${ifDefined(this.label ?? this.text)}
        ?inert=${this.state === ActionState.Disabled}
        ?iconOnly=${this.icon && !this.text}
      >
        ${this.renderContent()}
      </a>
    `;
  }

  protected renderContent(): TemplateResult {
    const result: TemplateResult[] = [];
    result.push(html`${this.renderIcon(this.icon)}`);
    result.push(
      html`${[
        this.renderState(),
        // this.renderLoader(),
        // this.renderConfirmed(),
        this.renderMarker(),
      ]}`
    );
    if (this.type !== ActionType.Icon) {
      result.push(html`<slot @slotchange=${() => this.onSlotChange()}>
        ${this.text}
      </slot>`);
    }
    result.push(html`${this.renderIcon(this.iconAfter)}`);
    return html`${result}`;
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
    this.toggleAttribute('inert', !!this.state);
  }

  protected renderIcon(icon?: IconTypes | string): TemplateResult | void {
    if (!icon) return;
    return html`<oryx-icon .type=${icon}></oryx-icon>`;
  }

  protected renderState(): TemplateResult | void {
    if (this.state === ActionState.Loading) {
      return html`<oryx-icon state .type=${IconTypes.Loader}></oryx-icon>`;
    }

    if (this.state === ActionState.Confirmed) {
      return html`<oryx-icon state .type=${IconTypes.Check}></oryx-icon>`;
    }
  }

  /**
   * The loader icon will be rendered when the component is not disabled.
   */
  // protected renderLoader(): TemplateResult | void {
  //   if (!this.loading || !this.confirmed || this.disabled) return;
  //   return html`<oryx-icon loader .type=${IconTypes.Loader}></oryx-icon>`;
  // }

  // /**
  //  * The loader icon will be rendered when the component state is not disabled nor loading
  //  */
  // protected renderConfirmed(): TemplateResult | void {
  //   if (!this.confirmed || this.disabled || this.loading) return;
  //   return html`<oryx-icon confirmed .type=${IconTypes.Check}></oryx-icon>`;
  // }

  protected renderMarker(): TemplateResult | void {
    if (this.mark) return html`<mark>${this.mark}</mark>`;
  }
}
