import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import { styles } from './picking-header.styles';

export class PickingHeaderComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  @state()
  protected cartNote?: string;

  @state()
  protected isCartNoteVisible?: boolean;

  @subscribe()
  protected subscription$ = this.pickingList$.pipe(
    tap((list) => {
      this.cartNote = list.cartNote;
    })
  );

  protected renderCartNoteButton(): TemplateResult {
    return html`${this.cartNote
      ? html`
          <oryx-icon-button>
            <button
              aria-label="Show customer note"
              @click=${() => (this.isCartNoteVisible = true)}
            >
              <oryx-icon type="info"></oryx-icon>
            </button>
          </oryx-icon-button>

          <oryx-customer-note-modal
            note=${ifDefined(this.isCartNoteVisible && this.cartNote)}
            @oryx.close=${() => (this.isCartNoteVisible = false)}
          ></oryx-customer-note-modal>
        `
      : ''}`;
  }

  protected override render(): TemplateResult {
    return html`<div class="title">
        <button
          aria-label="Back to pick lists"
          class="back"
          href="#"
          @click=${this.back}
        >
          <oryx-icon type="${IconTypes.Back}"></oryx-icon>
        </button>
        ${this.pickingListId}
      </div>
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
