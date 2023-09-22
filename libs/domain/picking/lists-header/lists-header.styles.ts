import { css } from 'lit';

export const pickingListsHeaderComponentStyles = css`
  oryx-picking-header {
    box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color-2);
  }

  oryx-picking-header div {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
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
