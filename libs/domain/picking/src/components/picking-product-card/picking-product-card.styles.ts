import { css } from 'lit';

export const styles = css`
  :host {
    text-align: center;
  }

  oryx-card {
    max-width: 380px;
    /* --oryx-card-header-padding: 10px;
    --oryx-card-body-padding: 7px 10px 10px; */
  }

  [slot='heading'] {
    width: 100%;
    text-align: center;
    overflow: hidden;
    /* stylelint-disable-next-line */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .subtitle {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--oryx-color-neutral-400);
  }

  .edit-quantity {
    margin-top: 7px;
  }

  .edit-quantity-info {
    margin-top: 14px;
    margin-bottom: 9px;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--oryx-color-ink);
  }

  .image {
    height: 106px;
    margin-top: 5px;
    object-fit: cover;
    max-width: 182px;

    &__fade {
      opacity: 0.4;
    }
  }

  oryx-cart-quantity-input {
    --oryx-cart-quantity-input-width: 102px;
  }

  .summary-info {
    margin-top: 12px;
    margin-bottom: 14px;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--oryx-color-ink);
  }

  .bold-text {
    font-weight: 600;
  }
`;
