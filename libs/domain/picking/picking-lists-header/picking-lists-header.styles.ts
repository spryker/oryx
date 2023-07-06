import { css } from 'lit';

export const pickingListsHeaderComponentStyles = css`
  :host {
    display: flex;
    align-items: center;
    padding: 22px;
    gap: 12px;
    box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color-2);
    background-color: var(--oryx-color-neutral-1);
    z-index: 2;
  }

  oryx-heading {
    text-transform: uppercase;
    white-space: nowrap;
    flex-grow: 1;
  }

  oryx-search {
    --floating-padding-start: 16px;
    --floating-width: calc(var(--oryx-layout-container-width) - 32px);
  }
`;
