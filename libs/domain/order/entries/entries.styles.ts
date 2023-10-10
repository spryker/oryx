import { featureVersion } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

const deprecatedStyles =
  featureVersion < '1.2'
    ? css`
        h3 {
          margin-block-end: 20px;
        }
      `
    : undefined;

export const orderEntriesStyles = css`
  :host {
    display: grid;
  }

  ${unsafeCSS(deprecatedStyles)}

  oryx-cart-entry:not(:last-child) {
    border-block-end: 1px solid var(--oryx-color-neutral-6);
  }

  oryx-button {
    margin-block-start: 10px;
    margin-inline: auto;
  }
`;
