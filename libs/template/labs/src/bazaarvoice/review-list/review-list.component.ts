import { ContentMixin } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { elementEffect, hydrate } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { loadBvScript } from '../script';
import { bzRatingStyles } from '../styles';
import { BazaarvoiceReviewListOptions } from './review-list.model';

@hydrate()
export class BazaarvoiceReviewListComponent extends ProductMixin(
  ContentMixin<BazaarvoiceReviewListOptions>(LitElement)
) {
  static styles = [bzRatingStyles];

  @elementEffect()
  protected loadScript = (): void => {
    const productId = this.$product()?.sku;
    if (productId) {
      loadBvScript().then((bv) => {
        const reviewsRefId = `${this.uid}-reviews`;
        this.createContainer(reviewsRefId);
        bv.ui('rr', 'show_reviews', {
          productId,
          summaryContainerDiv: reviewsRefId,
        });
      });
    }
  };

  /**
   * The review list integration comes with an additional element which cannot be controlled.
   * We therefor hide the element by a CSS rule.
   */
  protected hideContainer(): void {
    const styleId = 'hideBVRRSearchContainer';
    let style = document.getElementById(styleId) as HTMLStyleElement;

    if (!style) {
      style = document.createElement('style') as HTMLStyleElement;
      style.id = styleId;
      document.head.appendChild(style);

      const sheet = style.sheet as CSSStyleSheet;

      sheet.insertRule('#BVRRSearchContainer { display: none; }', 0);
    }
  }

  protected createContainer(id: string): void {
    if (!document.getElementById(id)) {
      const container: HTMLElement = document.createElement('div');
      container.setAttribute('id', id);
      document.body.appendChild(container);

      const move = () => {
        const el = document.getElementById(id);
        if (el) this.shadowRoot?.appendChild(el);
      };

      setTimeout(() => {
        move();
      }, 1000);
    }
  }
}
