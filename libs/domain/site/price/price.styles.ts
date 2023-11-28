import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

/**
 * @since 1.2.0
 */
export const priceStyles =
  featureVersion >= '1.2'
    ? css`
        :host([discounted]) {
          color: var(--oryx-color-highlight-9);
        }

        :host([original]) {
          text-decoration: line-through;
        }
      `
    : css``;
