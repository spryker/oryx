import { css } from 'lit';

export const pickingComponentStyles = css`
  :host {
    --sticky-offset: 66px;
  }

  [slot='panels'] {
    width: 100%;
  }

  .list-container {
    min-height: calc(100vh - 166px);
    padding: 25px 0 25px;
    display: grid;
    gap: 20px 0;
    grid-auto-rows: max-content;
    background-color: var(--oryx-color-neutral-3);
  }

  .fallback {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 166px);
  }

  .fallback oryx-heading h1 {
    margin: 30px 0 8px;
  }

  .fallback oryx-heading h2 {
    margin-block-end: 10px;
  }

  oryx-image {
    display: flex;
  }

  .picked-items-info {
    font-weight: 600;
  }

  .submit-wrapper {
    position: sticky;
    inset-block-end: 0;
    padding: 20px;
    background-color: var(--oryx-color-neutral-1);
    animation: slide-up 0.5s ease-in-out;
  }

  .scroll-shadow {
    box-shadow: 0 -1px 6px var(--oryx-color-neutral-4);
  }

  @keyframes slide-up {
    from {
      transform: translateY(50px);
    }

    to {
      transform: translateY(0);
    }
  }

  oryx-modal [slot='heading'] {
    font-size: 18px;
    font-weight: 600;
  }
`;
