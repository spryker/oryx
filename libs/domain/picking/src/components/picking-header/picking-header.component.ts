import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { map } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import { DiscardPickingComponent } from '../discard-modal';
import { styles } from './picking-header.styles';

export class PickingHeaderComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  protected discardModal = createRef<DiscardPickingComponent>();

  @state() isCartNoteVisible?: boolean;

  @asyncState()
  shouldOpenModal = valueType(
    this.routerService
      .routeGuard()
      .pipe(map((routeGuard) => routeGuard.startsWith('/picking-list')))
  );

  override firstUpdated(): void {
    if (this.shouldOpenModal) {
      this.openDiscardModal();
    }
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
        }}
      ></oryx-site-navigation-item>
      <oryx-discard-picking
        ${ref(this.discardModal)}
        @oryx.back=${this.back}
      ></oryx-discard-modal>`;
  }

  protected openDiscardModal(): void {
    const modal = this.discardModal.value;
    modal && (modal.open = true);
  }

  protected back(): void {
    this.routerService.back(this.pickingList?.cartNote ? 2 : 1);
  }
}

export default PickingHeaderComponent;
