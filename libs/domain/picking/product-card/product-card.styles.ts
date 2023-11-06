import { featureVersion } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

export const pickingProductCardComponentStyles = css`
  :host {
    text-align: center;
    margin: 0 20px;
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

  form {
    margin-block-start: 7px;
  }

  form div {
    margin-block-start: 14px;
    margin-block-end: 9px;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--oryx-color-neutral-12);
  }

  oryx-image {
    display: block;
    fill: var(--oryx-color-neutral-12);
    height: 106px;
    margin-block-start: 5px;
    object-fit: cover;
  }

  .image-fade {
    opacity: 0.4;
  }

  oryx-quantity-input {
    ${unsafeCSS(featureVersion >= '1.2' ?
      '--oryx-quantity-input-width: 102px;':
      '--oryx-cart-quantity-input-width: 102px;'
    )}
  }

  .summary-info {
    margin-block-start: 12px;
    margin-block-end: 14px;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--oryx-color-neutral-12);
  }

  p {
    margin: 0;
  }

  .bold-text {
    font-weight: 600;
  }

  oryx-button {
    display: block;
  }
`;
