import { css } from 'lit';

export const pickingListsComponentStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 100vh;
    background-color: var(--oryx-color-neutral-3);

    /* tmp, we rather use pages with layout */
    width: min(
      100%,
      min(
        var(--oryx-container-width),
        calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
      )
    );
    margin: auto;
  }

  section {
    display: grid;
    gap: 25px;
  }

  oryx-picking-lists-header {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
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

  .sync {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-block-start: 34px;
  }

  .loading span {
    font-weight: 600;
  }
`;
