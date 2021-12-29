import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../../error-message/src/index';
import { FormControlComponent } from '../../form-control/src/form-control.component';
import { affixStyles } from './styles/affix.styles';
import { disableStyles } from './styles/disabled.styles';
import { errorStyles } from './styles/error.styles';
import { textControlStyles } from './styles/text-control.styles';

export class TextControlComponent extends FormControlComponent {
  static styles = [textControlStyles, disableStyles, errorStyles, affixStyles];

  @property() prefixIcon?: string;
  @property({ reflect: true, type: Boolean }) prefixFill?: boolean;

  protected hasPrefixContent?: boolean;

  @property() suffixIcon?: string;
  @property({ reflect: true, type: Boolean }) suffixFill?: boolean;
  protected hasSuffixContent?: boolean;

  constructor() {
    super();
    this.addEventListener('click', () => this.control?.focus());
  }

  render(): TemplateResult {
    return html`
      ${this.renderLabel()}

      <div class="control">
        <slot name="prefix" @slotchange=${this.handlePrefixContent}>
          ${this.prefixIcon
            ? html`<oryx-icon type="${this.prefixIcon}"></oryx-icon>`
            : html``}
        </slot>

        <slot @slotchange=${this.handleSlotChange}></slot>

        <slot name="suffix" @slotchange=${this.handleSuffixContent}>
          ${this.suffixIcon
            ? html`<oryx-icon type="${this.suffixIcon}"></oryx-icon>`
            : html``}
        </slot>
      </div>

      ${this.renderErrorMessages()}
    `;
  }

  protected handleSlotChange(): void {
    this.handleDisabledControl();
  }

  protected handlePrefixContent(): void {
    const hasContent = this.querySelectorAll('[slot=prefix]').length > 0;
    this.hasPrefixContent = hasContent;
    this.classList.toggle('has-prefix-content', this.hasPrefixContent);
  }

  protected handleSuffixContent(): void {
    const hasContent = this.querySelectorAll('[slot=suffix]').length > 0;
    this.hasSuffixContent = hasContent;
    this.classList.toggle('has-suffix-content', this.hasSuffixContent);
  }
}
