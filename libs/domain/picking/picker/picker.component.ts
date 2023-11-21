import { resolve } from '@spryker-oryx/di';
import {
  PartialPicking,
  PickingGuardService,
  PickingListMixin,
  PickingTab,
  ProductItemPickedEvent,
} from '@spryker-oryx/picking';
import { PickingProductCardComponent } from '@spryker-oryx/picking/product-card';
import {
  ItemsFilters,
  PickingListItem,
  PickingListStatus,
} from '@spryker-oryx/picking/services';
import { RouterService } from '@spryker-oryx/router';
import { ButtonColor, ButtonType } from '@spryker-oryx/ui/button';
import { ChipComponent } from '@spryker-oryx/ui/chip';
import { TabComponent } from '@spryker-oryx/ui/tab';
import { TabsAppearance } from '@spryker-oryx/ui/tabs';
import { I18nMixin, computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { catchError, of, switchMap, take, tap } from 'rxjs';
import { pickingComponentStyles } from './picker.styles';

export class PickingPickerComponent extends I18nMixin(
  PickingListMixin(LitElement)
) {
  static styles = pickingComponentStyles;

  protected routerService = resolve(RouterService);
  protected pickingGuardService = resolve(PickingGuardService);

  @state()
  protected partialPicking: PartialPicking | null = null;

  @state()
  protected items: PickingListItem[] = [];

  protected $items = computed(() => this.$pickingList()?.items);

  protected productCardRef: Ref<PickingProductCardComponent> = createRef();
  protected notPickedTabRef: Ref<TabComponent> = createRef();
  protected tabRefs: Ref<TabComponent>[] = [
    this.notPickedTabRef,
    createRef(),
    createRef(),
  ];

  protected chipRefs: Ref<ChipComponent>[] = [
    createRef(),
    createRef(),
    createRef(),
  ];

  protected buildTabs(): PickingTab[] {
    this.items = this.$items();

    return [
      {
        id: ItemsFilters.NotPicked,
        title: 'not-Picked',
        items: this.items?.filter(
          (item) => item.status === ItemsFilters.NotPicked
        ),
      },
      {
        id: ItemsFilters.Picked,
        title: 'picked',
        items: this.items?.filter(
          (item) => item.numberOfPicked && item.status === ItemsFilters.Picked
        ),
      },
      {
        id: ItemsFilters.NotFound,
        title: 'not-Found',
        items: this.items?.filter(
          (item) =>
            item.status === ItemsFilters.Picked &&
            (item.numberOfNotPicked || item.numberOfPicked < item.quantity)
        ),
      },
    ];
  }

  protected savePickingItem(event: CustomEvent<ProductItemPickedEvent>): void {
    const { productId, numberOfPicked } = event.detail;

    const productIndex = this.$pickingList()?.items.findIndex(
      (item) => item.id === productId
    );

    if (
      !(numberOfPicked && numberOfPicked === this.items[productIndex].quantity)
    ) {
      this.partialPicking = {
        productId: productId,
        currentNumberOfPicked: numberOfPicked,
        quantity: this.items[productIndex].quantity,
      };

      return;
    }

    this.updatePickingItem(productIndex, numberOfPicked);
  }

  protected async editPickingItem(
    event: CustomEvent<ProductItemPickedEvent>
  ): Promise<void> {
    const { productId } = event.detail;

    const productIndex = this.$pickingList()?.items.findIndex(
      (item) => item.id === productId
    );
    this.items[productIndex].status = ItemsFilters.NotPicked;

    this.items = [...this.items];

    this.notPickedTabRef.value?.dispatchEvent(
      new CustomEvent('click', {
        composed: true,
        bubbles: true,
      })
    );

    await this.updateComplete;

    this.productCardRef.value?.scrollIntoView({
      behavior: 'smooth',
    });

    this.productCardRef.value?.focusOnQuantityInput();
  }

  protected onModalClose(): void {
    this.partialPicking = null;
  }

  protected confirmPartialPicking(): void {
    const productIndex = this.$pickingList()?.items.findIndex(
      (item) => item.id === this.partialPicking?.productId
    );

    this.updatePickingItem(
      productIndex,
      this.partialPicking?.currentNumberOfPicked
    );

    this.partialPicking = null;
  }

  protected finishPicking(): void {
    this.$pickingList().status = PickingListStatus.PickingFinished;

    // ToDo: update this logic after Bapi is fully integrated in fulfillment app
    this.pickingListService
      .finishPicking(this.$pickingList())
      .pipe(
        take(1),
        catchError(() => of(null)),
        tap(() => {
          this.pickingGuardService.allow();
          this.routerService.navigate(`/`);

        }),
      )
      .subscribe();
  }

  protected override render(): TemplateResult {
    const tabs = this.buildTabs();

    return html`
      <oryx-tabs
        appearance="${TabsAppearance.Secondary}"
        sticky
        shadow
        @click=${this.onTabChange}
      >
        ${this.renderTabs(tabs)} ${this.renderTabContents(tabs)}
      </oryx-tabs>
      ${this.renderConfirmationModal()}
    `;
  }

  protected renderTabs(tabs: PickingTab[]): TemplateResult {
    return html`
      ${repeat(
        tabs,
        (tab, index) => html`
          <oryx-tab for="tab-${tab.id}" ${ref(this.tabRefs[index])}>
            ${this.i18n(`picking.${tab.title}`)}
            <oryx-chip dense ${ref(this.chipRefs[index])}
              >${tab.items?.length ?? '0'}</oryx-chip
            >
          </oryx-tab>
        `
      )}
    `;
  }

  protected renderTabContents(tabs: PickingTab[]): TemplateResult {
    return html`
      ${repeat(
        tabs,
        (tab) => html`
          <div slot="panels" id="tab-${tab.id}">
            ${when(
              tab.items?.length,
              () => html`
                <div class="list-container">
                  ${repeat(
                    tab.items,
                    (item) => item.id,
                    (item) =>
                      html`
                        <oryx-picking-product-card
                          ${tab.id === ItemsFilters.NotPicked
                            ? ref(this.productCardRef)
                            : ''}
                          .productItem=${item}
                          .status=${tab.id}
                          @oryx.submit=${this.savePickingItem}
                          @oryx.edit=${this.editPickingItem}
                        ></oryx-picking-product-card>
                      `
                  )}
                </div>
                ${this.renderFinishButton(true)}
              `,
              () => this.renderFallback()
            )}
          </div>
        `
      )}
    `;
  }

  protected renderFinishPickingFallback(): TemplateResult {
    return html`
      <section>
        <oryx-image resource="picking-items-processed"></oryx-image>
        <oryx-heading>
          <h1>${this.i18n(`picking.processed.success`)}</h1>
        </oryx-heading>
        <span>${this.i18n(`picking.processed.all`)}</span>
      </section>
      ${this.renderFinishButton()}
    `;
  }

  protected renderNoItemsFallback(): TemplateResult {
    return html`
      <section>
        <oryx-heading>
          <h2>${this.i18n(`picking.no-items`)}!</h2>
        </oryx-heading>
        <oryx-image resource="no-orders"></oryx-image>
      </section>
    `;
  }

  protected renderFallback(): TemplateResult {
    if (!this.items?.length || !this.allItemsPicked) {
      return this.renderNoItemsFallback();
    } else {
      return this.renderFinishPickingFallback();
    }
  }

  protected get allItemsPicked(): boolean {
    return this.items?.every((item) => item.status === ItemsFilters.Picked);
  }

  protected renderFinishButton(hasShadow?: boolean): TemplateResult | void {
    if (!this.allItemsPicked) {
      return;
    }

    return html`
      <div
        class="submit-wrapper${classMap({
          'scroll-shadow': hasShadow ?? false,
        })}"
      >
        <div>
          <oryx-button
            .type=${ButtonType.Outline}
            .color=${ButtonColor.Primary}
            .text=${this.i18n('picking.finish-picking')}
            @click=${this.finishPicking}
          ></oryx-button>
        </div>
      </div>
    `;
  }

  protected renderConfirmationModal(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.partialPicking}
        enableFooter
        preventclosebybackdrop
        footerButtonFullWidth
        minimal
      >
        <div slot="heading">
          ${this.i18n('picking.product-card.confirm-picking')}
        </div>

        <span>
          ${this.i18n('picking.product-card.you-only-picked')}
          <span class="picked-items-info">
            ${this.partialPicking?.currentNumberOfPicked}
            ${this.i18n('picking.product-card.-out-of')}
            ${this.partialPicking?.quantity}
          </span>
          ${this.i18n('picking.product-card.items')}.
          ${this.i18n(
            'picking.product-card.do-you-really-want-to-complete-the-pick?'
          )}
        </span>

        <oryx-button
          slot="footer"
          .type=${ButtonType.Outline}
          .color=${ButtonColor.Neutral}
          .text=${this.i18n('picking.product-card.cancel')}
          @click=${this.onModalClose}
        ></oryx-button>

        <oryx-button
          slot="footer"
          .color=${ButtonColor.Primary}
          .text=${this.i18n('picking.product-card.confirm')}
          @click=${this.confirmPartialPicking}
        ></oryx-button>
      </oryx-modal>
    `;
  }

  protected override updated(): void {
    this.onTabChange();
  }

  protected async getUpdateComplete(): Promise<boolean> {
    await super.getUpdateComplete();
    return (await this.notPickedTabRef.value?.updateComplete) ?? false;
  }

  protected onTabChange(): void {
    for (let i = 0; i < this.tabRefs.length; i++) {
      const tab = this.tabRefs[i].value;
      if (!tab) {
        continue;
      }
      const chip = this.chipRefs[i].value;
      if (tab.selected) {
        chip?.setAttribute('appearance', 'success');
      } else {
        chip?.removeAttribute('appearance');
      }
    }
  }

  private updatePickingItem(
    productIndex: number,
    numberOfPicked?: number
  ): void {
    this.items[productIndex].numberOfPicked = numberOfPicked ?? 0;
    this.items[productIndex].numberOfNotPicked =
      this.items[productIndex].quantity -
      this.items[productIndex].numberOfPicked;

    this.items[productIndex].status = ItemsFilters.Picked;

    this.items = [...this.items];
  }
}
