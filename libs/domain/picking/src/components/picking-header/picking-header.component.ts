import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { PickingListMixin } from '../../mixins';
import { styles } from './picking-header.styles';

export class PickingHeaderComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  @state() isCartNoteVisible?: boolean;

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
          label: i18n('oryx.picking.account'),
        }}
      ></oryx-site-navigation-item>`;
  }

  protected back(): void {
    //TODO - display discard modal
    this.routerService.back();
  }
}

export default PickingHeaderComponent;
