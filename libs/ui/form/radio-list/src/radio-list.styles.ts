import { css } from 'lit';

export const styles = css`
  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
  }

  legend {
    display: none;
    margin-block-end: 8px;
    color: var(--oryx-color-ink);
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-transform: uppercase;
  }

  legend[hasHeading] {
    display: block;
  }

  .content {
    display: flex;
    gap: 8px;
  }

  :host([direction='vertical']) .content {
    flex-direction: column;
  }

  [hasErrorContent] {
    margin-block-start: 1px;
    margin-inline-start: 1px;
  }
`;
