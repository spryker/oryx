import { resolve } from '@spryker-oryx/di';
import { PickingHeaderService, PickingListMixin } from '@spryker-oryx/picking';
import { DiscardPickingComponent } from '@spryker-oryx/picking/discard-modal';
import { RouterService } from '@spryker-oryx/router';
import { ButtonSize, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, subscribe } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { tap } from 'rxjs';
import { styles } from './picking-header.styles';

export class PickingHeaderComponent extends I18nMixin(
  PickingListMixin(LitElement)
) {
  static styles = styles;

  protected routerService = resolve(RouterService);
  protected pickingHeaderService = resolve(PickingHeaderService);

  @query('oryx-discard-picking')
  protected discardModal?: DiscardPickingComponent;

  @state() isCartNoteVisible?: boolean;

  @subscribe()
  protected showDialog$ = this.pickingHeaderService
    .showDialog()
    .pipe(
      tap((showDialog) =>
        showDialog ? this.openDiscardModal() : this.closeDiscardModal()
      )
    );

  protected renderCartNoteButton(): TemplateResult {
    return html`${this.$pickingList()?.cartNote
      ? html`
          <oryx-button
            .type=${ButtonType.Icon}
            .size=${ButtonSize.Md}
            .label=${this.i18n('oryx.picking.customer-note')}
            .icon=${IconTypes.Info}
            @click=${() => (this.isCartNoteVisible = true)}
          ></oryx-button>
          <oryx-customer-note-modal
            ?open=${this.isCartNoteVisible}
            @oryx.close=${() => (this.isCartNoteVisible = false)}
          >
            ${this.$pickingList()?.cartNote}
          </oryx-customer-note-modal>
        `
      : ''}`;
  }

  protected override render(): TemplateResult {
    return html`
      <oryx-header>
        <oryx-button
          .type=${ButtonType.Icon}
          .size=${ButtonSize.Md}
          .icon=${IconTypes.ArrowBack}
          .label=${this.i18n('oryx.picking.back-to-pick-lists')}
          @click=${this.back}
        ></oryx-button>
        <div class="title">${this.$pickingList()?.orderReferences[0]}</div>
        ${this.renderCartNoteButton()}
        <oryx-discard-picking
          @oryx.close=${() => {
            this.pickingHeaderService.cancel();
            this.closeDiscardModal();
          }}
          @oryx.back=${this.leave}
        ></oryx-discard-picking>
      </oryx-header>
    `;
  }

  protected openDiscardModal(): void {
    this.discardModal?.toggleAttribute('open', true);
  }

  protected closeDiscardModal(): void {
    this.discardModal?.toggleAttribute('open', false);
  }

  protected leave(): void {
    this.pickingHeaderService.discard();
  }

  protected back(): void {
    this.routerService.back();
  }
}

export default PickingHeaderComponent;
