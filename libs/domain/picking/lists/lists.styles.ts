import { css } from 'lit';

export const pickingListsComponentStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-block-start: 20px;
    background-color: var(--oryx-color-neutral-3);
  }

  section {
    display: grid;
    gap: 25px;
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
