import { css } from 'lit';

export const styles = css`
  .eb-preview-focus {
    outline: 4px solid var(--oryx-color-brand);
    outline-offset: -4px;
    position: relative;
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
    background-color: var(--oryx-color-brand);
  }
`;
