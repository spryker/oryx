import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { ROUTE_GUARDED_EVENT } from '@spryker-oryx/router/lit';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';
import { take, tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import { DiscardPickingComponent } from '../discard-modal';
import { styles } from './picking-header.styles';

export class PickingHeaderComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  @query('oryx-discard-picking')
  protected discardModal?: DiscardPickingComponent;

  @state() isCartNoteVisible?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener(ROUTE_GUARDED_EVENT, () => this.openDiscardModal());
  }

  protected renderCartNoteButton(): TemplateResult {
    return html`${this.pickingList?.cartNote
      ? html`
          <oryx-icon-button>
            <button
              aria-label=${i18n('oryx.picking.customer-note')}
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
          aria-label=${i18n('oryx.picking.back-to-pick-lists')}
          class="back"
          href="#"
          @click=${this.openDiscardModal}
        >
          <oryx-icon type=${IconTypes.Back}></oryx-icon>
        </button>
      </oryx-icon-button>
      <div class="title">${this.pickingListId}</div>
      ${this.renderCartNoteButton()}
      <oryx-site-navigation-item
        uid="user-profile"
        .options=${{
          icon: IconTypes.Profile,
          triggerType: 'icon',
          contentBehavior: 'modal',
          label: i18n('oryx.picking.account'),
        }}
      ></oryx-site-navigation-item>
      <oryx-discard-picking
        @oryx.close=${this.closeDiscardModal}
        @oryx.back=${this.back}
      ></oryx-discard-picking>`;
  }

  protected openDiscardModal(): void {
    this.discardModal?.toggleAttribute('open', true);
  }

  protected closeDiscardModal(): void {
    this.discardModal?.toggleAttribute('open', false);
  }

  protected back(): void {
    this.pickingListService
      .finishPicking(this.pickingList)
      .pipe(
        take(1),
        tap(() => {
          this.routerService.back();
        })
      )
      .subscribe();
  }
}

export default PickingHeaderComponent;
