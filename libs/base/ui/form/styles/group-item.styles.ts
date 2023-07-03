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
  }

  slot[name='subtext'] {
    ${headingUtil(HeadingTag.Caption)};

    display: block;
    grid-column: 2 / span 1;
    color: var(--oryx-color-neutral-9);
  }

  slot[name='subtext']::slotted(*:not(:empty)) {
    display: block;
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
