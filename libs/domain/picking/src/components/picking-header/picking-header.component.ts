import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import { styles } from './picking-header.styles';

export class PickingHeaderComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  @state()
  protected cartNote?: string;

  @subscribe()
  protected subscription$ = this.pickingList$.pipe(
    tap((list) => {
      this.cartNote = list.cartNote;
    })
  );

  protected renderCartNoteButton(): TemplateResult {
    return html`${this.cartNote
      ? html` <oryx-icon-button
          ><button area-label="Show customer note">
            <oryx-icon type="info"></oryx-icon></button
        ></oryx-icon-button>`
      : ''}`;
  }

  protected override render(): TemplateResult {
    return html`<div class="title">
        <a class="back" href="#" @click=${this.back}
          ><oryx-icon type="back"></oryx-icon
        ></a>
        ${this.pickingListId}
      </div>
      ${this.renderCartNoteButton()}
      <oryx-site-navigation-item
        uid="user-profile"
        .options=${{
          icon: 'profile',
          triggerType: 'icon',
          contentBehavior: 'modal',
        }}
      ></oryx-site-navigation-item>`;
  }

  protected back(): void {
    this.routerService.back();
  }
}

export default PickingHeaderComponent;
