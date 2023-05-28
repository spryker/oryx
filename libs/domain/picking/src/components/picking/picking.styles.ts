import { css } from 'lit';

export const pickingComponentStyles = css`
  .tab-panels {
    min-height: 100vh;
    width: 100%;
  }

  .list-container {
    position: relative;
    height: 100%;
    padding: 25px 0;
    display: grid;
    gap: 20px 0;
    grid-auto-rows: max-content;
  }

  .picking-complete {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  .title-empty {
    font-size: 20px;
    line-height: 28px;
    margin-block-end: 0;
  }

  .img-wrap {
    padding: 100px 16% 30px;
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
