import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const swatchBaseStyle = css`
  :host {
    display: inline-block;
    height: 15px;
    width: 15px;
    aspect-ratio: 1/1;
    outline: 1px solid var(--oryx-color-neutral-6);
    outline-offset: 3px;
    border-radius: 2px;
    background: var(--swatch) center center;
    background-size: cover;

    ${featureVersion >= '1.4'
      ? css``
      : css`
          margin: 4px;
        `}
  }
`;
