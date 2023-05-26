import { primaryColor } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const previewStyles = css`
  .eb-preview-focus {
    position: relative;
  }

  .eb-preview-focus::before {
    content: '';
    outline: 4px solid ${primaryColor()};
    outline-offset: -4px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: var(--oryx-overlay-z-index, 3);
  }

  .eb-preview-focus::after {
    content: attr(name);
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: 0;
    color: #fff;
    font: 500 16px/22px Montserrat, sans-serif;
    padding: 2px 5px;
    background-color: ${primaryColor()};
    z-index: var(--oryx-overlay-z-index, 3);
  }
`;
