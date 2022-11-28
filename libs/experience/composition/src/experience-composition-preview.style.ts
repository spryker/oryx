import { css } from 'lit';

export const previewStyles = css`
  .eb-preview-focus {
    position: relative;
  }
  .eb-preview-focus:before {
    content: '';
    outline: 4px solid var(--oryx-color-primary-300);
    outline-offset: -4px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: var(--oryx-overlay-z-index, 3);
  }

  .eb-preview-focus:after {
    content: attr(name);
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 16px;
    line-height: 22px;
    font-weight: 500;
    font-family: 'Montserrat';
    padding: 2px 5px;
    background-color: var(--oryx-color-primary-300);
    z-index: var(--oryx-overlay-z-index, 3);
  }
`;
