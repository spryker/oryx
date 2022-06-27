import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductComponentMixin } from '@spryker-oryx/product';
import { html, TemplateResult } from 'lit';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { AddToCartContent } from './add-to-cart.model';
import { styles } from './add-to-cart.styles';

export class AddToCartComponent extends ProductComponentMixin<AddToCartContent>() {
  static styles = styles;

  protected inputRef: Ref<HTMLInputElement> = createRef();
  protected formRef: Ref<HTMLFormElement> = createRef();

  protected contentController = new ContentController(this);
  protected content$ = this.contentController.getContent();
  protected quantity$ = new BehaviorSubject(1);

  protected cartData$ = combineLatest([this.content$, this.quantity$]).pipe(
    map(([content, quantity]) => {
      return { content, quantity };
    })
  );

  protected onSubmit(e: Event): void {
    e.preventDefault();

    //TODO: call AddToCartService method that will add the product to the cart
  }

  protected increase(): void {
    this.inputRef.value?.stepUp();
    this.setQuantity();
  }

  protected decrease(): void {
    this.inputRef.value?.stepDown();
    this.setQuantity();
  }

  protected setQuantity(): void {
    this.quantity$.next(Number(this.inputRef.value?.value));
  }

  protected onInputKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.formRef.value?.reportValidity()) {
        this.onSubmit(e);
      }
    }
  }

  protected override render(): TemplateResult {
    return html`
      <form ${ref(this.formRef)} @submit=${this.onSubmit}>
        ${asyncValue(
          this.cartData$,
          ({ content, quantity }) => html`
            ${when(
              !content?.hideQuantityInput,
              () => html`
                <oryx-button icon outline type="secondary" size="small">
                  <button
                    ?disabled=${content?.loading || quantity <= 1}
                    @click=${this.decrease}
                  >
                    <oryx-icon type="minus"></oryx-icon>
                  </button>
                </oryx-button>
                <oryx-input>
                  <input
                    type="number"
                    ${ref(this.inputRef)}
                    value="1"
                    min="1"
                    step="1"
                    required
                    ?disabled=${content?.loading}
                    @input=${this.setQuantity}
                    @keydown=${this.onInputKeydown}
                  />
                </oryx-input>
                <oryx-button icon outline type="secondary" size="small">
                  <button ?disabled=${content?.loading} @click=${this.increase}>
                    <oryx-icon type="add"></oryx-icon>
                  </button>
                </oryx-button>
              `
            )}
            <oryx-button icon size="small" ?loading=${content?.loading}>
              <button>
                <oryx-icon type="add"></oryx-icon>
                Add to Cart
              </button>
            </oryx-button>
          `
        )}
      </form>
    `;
  }
}
