import { css } from 'lit';

export const styles = css`
  :host {
    text-align: center;
    margin: 0 20px;
  }

  .title {
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
    margin-block-start: 7px;
  }

  .edit-quantity-info {
    margin-block-start: 14px;
    margin-block-end: 9px;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--oryx-color-ink);
  }

  oryx-image {
    display: block;
    fill: var(--oryx-color-ink);
    height: 106px;
    margin-block-start: 5px;
    object-fit: cover;
  }

  .image-fade {
    opacity: 0.4;
  }

  oryx-cart-quantity-input {
    --oryx-cart-quantity-input-width: 102px;
  }

  .summary-info {
    margin-block-start: 12px;
    margin-block-end: 14px;
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
