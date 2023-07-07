import { resolve } from '@spryker-oryx/di';
import { PickingHeaderService, PickingListMixin } from '@spryker-oryx/picking';
import { DiscardPickingComponent } from '@spryker-oryx/picking/discard-modal';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { I18nMixin, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
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
    return html`${this.pickingList?.cartNote
      ? html`
          <oryx-icon-button>
            <button
              aria-label=${this.i18n('oryx.picking.customer-note')}
              @click=${() => (this.isCartNoteVisible = true)}
            >
              <oryx-icon type=${IconTypes.Info}></oryx-icon>
            </button>
          </oryx-icon-button>
          <oryx-customer-note-modal
            ?open=${this.isCartNoteVisible}
            @oryx.close=${() => (this.isCartNoteVisible = false)}
          >
            ${this.pickingList?.cartNote}
          </oryx-customer-note-modal>
        `
      : ''}`;
  }

  protected override render(): TemplateResult {
    return html` <oryx-icon-button>
        <button
          aria-label=${this.i18n('oryx.picking.back-to-pick-lists')}
          class="back"
          href="#"
          @click=${this.back}
        >
          <oryx-icon type=${IconTypes.ArrowBack}></oryx-icon>
        </button>
      </oryx-icon-button>
      <div class="title">${this.pickingList?.orderReferences[0]}</div>
      ${this.renderCartNoteButton()}
      <oryx-site-navigation-item
        uid="user-profile"
        .options=${{
          icon: IconTypes.Profile,
          triggerType: 'icon',
          contentBehavior: 'modal',
          label: this.i18n('oryx.picking.account'),
        }}
      ></oryx-site-navigation-item>
      <oryx-discard-picking
        @oryx.close=${() => {
          this.pickingHeaderService.cancel();
          this.closeDiscardModal();
        }}
        @oryx.back=${this.leave}
      ></oryx-discard-picking>`;
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
