import { css } from 'lit';

export const groupItemStyles = css`
  :host {
    display: grid;
    grid-template-columns: min-content 1fr;
    column-gap: 8px;
    align-items: center;
    position: relative;
  }

  label {
    display: contents;
    outline: 0;
    color: var(--oryx-color-inc);
  }

  slot[name='subtext'] {
    display: block;
    grid-column: 2 / span 1;
  }

  slot[name='subtext']::slotted(small) {
    font-weight: 600;
    color: var(--oryx-color-neutral-300);
  }

  oryx-error-message {
    grid-column: 1 / span 2;
  }

  [hasErrorContent] {
    margin-block-start: 4px;
    font-size: 0.85em;
    font-weight: 400;
  }
`;
