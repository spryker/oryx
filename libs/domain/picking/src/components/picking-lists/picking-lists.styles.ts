import { css } from 'lit';

export const pickingListsComponentStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 100vh;
    background-color: var(--oryx-color-neutral-3);
  }

  section {
    display: grid;
    gap: 25px;
  }

  oryx-picking-lists-header {
    position: sticky;
    inset-block-start: 0;
  }

  .no-items-fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    margin: 45px;
    gap: 16px;
  }

  oryx-image {
    margin-inline: 40px;
    display: block;
  }

  .filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  section,
  .filters {
    padding: 0 20px;
  }
`;
