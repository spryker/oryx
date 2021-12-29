import { css } from 'lit';

/**
 * Provides style rules for the prefix and suffix structure
 * of text controls.
 */
export const affixStyles = css`
  slot[name='prefix'],
  slot[name='suffix'] {
    display: flex;
    align-items: center;
  }

  slot[name='prefix'] {
    border-start-start-radius: calc(var(--oryx-border-radius) - 2px);
    border-end-start-radius: calc(var(--oryx-border-radius) - 2px);
  }

  slot[name='suffix'] {
    border-start-end-radius: calc(var(--oryx-border-radius) - 2px);
    border-end-end-radius: calc(var(--oryx-border-radius) - 2px);
  }

  :host(.has-prefix-content) slot[name='prefix'],
  slot[name='prefix'] oryx-icon {
    padding-inline-start: 10px;
  }

  :host(.has-suffix-content) slot[name='suffix'],
  slot[name='suffix'] oryx-icon {
    padding-inline-end: 10px;
  }

  :host([prefixFill]) slot[name='prefix'],
  :host([suffixFill]) slot[name='suffix'] {
    background-color: var(--oryx-color-neutral-lighter);
    white-space: nowrap;
  }

  :host([prefixFill]) slot[name='prefix'] {
    padding-inline-end: 10px;
  }
  :host([suffixFill]) slot[name='suffix'] {
    padding-inline-start: 10px;
  }
`;
