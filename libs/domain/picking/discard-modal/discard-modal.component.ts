import { resolve } from '@spryker-oryx/di';
import { PickingGuardService } from '@spryker-oryx/picking';
import { RouterService } from '@spryker-oryx/router';
import { ButtonColor, ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, featureVersion, signal } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { discardModalStyles } from './discard-modal.styles';

export class PickingDiscardModalComponent extends I18nMixin(LitElement) {
  static styles = discardModalStyles;

  @property({ type: Boolean, reflect: true }) open?: boolean;

  protected pickingGuardService = resolve(PickingGuardService);
  protected routerService = resolve(RouterService);

  protected $isProtected = signal(this.pickingGuardService.isProtected());

  protected override render(): TemplateResult {
    return html`
      <oryx-button
        .type=${ButtonType.Icon}
        .icon=${IconTypes.ArrowBackward}
        .label=${this.i18n('picking.back-to-pick-lists')}
        @click=${this.onBack}
      ></oryx-button>

      <oryx-modal
        ?open=${this.open}
        @oryx.close=${this.cancel}
        @oryx.modal.closed=${this.cancel}
        enableFooter
        preventCloseByEscape
        footerButtonFullWidth
        minimal
      >
        ${this.__renderHeading()}${this.i18n('picking.discard.stop-picking')}
        <span class="additional-text"
          >${this.i18n('picking.discard.warning')}</span
        >

        <oryx-button
          slot="footer"
          .type=${ButtonType.Outline}
          .color=${ButtonColor.Neutral}
          .size=${ButtonSize.Md}
          @click=${this.cancel}
        >
          ${this.i18n('picking-lists.cancel')}
        </oryx-button>

        <oryx-button
          slot="footer"
          .color=${ButtonColor.Error}
          .size=${ButtonSize.Md}
          @click=${this.discard}
        >
          ${this.i18n('picking-lists.discard')}
        </oryx-button>
      </oryx-modal>
    `;
  }

  // temporary implementation for backwards compatibility
  private __renderHeading(): TemplateResult {
    const text = this.i18n('picking.discard.pick-list');
    if (featureVersion >= '1.4') {
      return html`<oryx-heading slot="heading" .tag=${HeadingTag.H2}>
        ${text}
      </oryx-heading>`;
    } else {
      return html`<oryx-heading slot="heading">
        <h2>${text}</h2>
      </oryx-heading>`;
    }
  }

  protected onBack(): void {
    if (!this.$isProtected()) {
      this.routerService.back();
    } else {
      this.open = true;
    }
  }

  protected cancel(): void {
    this.open = false;
  }

  protected discard(): void {
    this.pickingGuardService.allow();
    this.routerService.back();
    this.open = false;
  }
}
