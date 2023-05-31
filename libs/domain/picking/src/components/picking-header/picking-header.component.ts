import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { PickingListMixin } from '../../mixins';
import { styles } from './picking-header.styles';

export class PickingHeaderComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  protected renderCartNoteButton(): TemplateResult {
    return html`${this.pickingList?.cartNote
      ? html` <oryx-icon-button
          ><button aria-label=${i18n('oryx.picking.customer-note')}>
            <oryx-icon type=${IconTypes.Info}></oryx-icon></button
        ></oryx-icon-button>`
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
      ></oryx-site-navigation-item>`;
  }

  protected back(): void {
    //TODO - display discard modal
    this.routerService.back();
  }
}

export default PickingHeaderComponent;
