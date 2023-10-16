import { css } from 'lit';

export const facetValueNavigationStyles = css`
  section {
    display: flex;
    align-items: center;
    flex-grow: 1;
    font-size: 16px;
    font-weight: normal;
  }

  section oryx-button {
    font-size: 14px;
    margin-inline-start: auto;
  }

  section button,
  slot:not([name]) + oryx-button button {
    color: var(--oryx-color-primary-9);
  }

  oryx-chip {
    margin-inline-start: 10px;
  }

  slot:not([name]) + oryx-button {
    width: fit-content;
    padding-block-start: 10px;
  }

  oryx-collapsible {
    width: 100%;
    border: none;
  }

  oryx-collapsible::part(heading) {
    padding-block: 10px;
  }

  slot:not([name]) {
    display: block;
    padding-inline: var(--inline-padding);
    padding-block: var(--block-padding);
  }

  oryx-search {
    margin-block-end: 15px;
  }
`;
