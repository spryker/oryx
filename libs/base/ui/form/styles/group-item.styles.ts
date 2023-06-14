import { css } from 'lit';
import { HeadingTag, headingUtil } from '../../structure/heading/src';

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
    ${headingUtil(HeadingTag.Caption)};

    display: flex;
    grid-column: 2 / span 1;
    color: var(--oryx-color-neutral-9);
  }

  ::slotted([slot='subtext']:first-of-type) {
    margin-block-start: 4px;
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
