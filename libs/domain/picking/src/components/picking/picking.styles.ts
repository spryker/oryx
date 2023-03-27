import { css } from 'lit';

export const styles = css`
  .tab-panels {
    width: 100%;
  }

  .picking-complete {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title-empty {
    font-size: 20px;
    line-height: 28px;
    margin-block-end: 0;
  }

  .img-wrap {
    padding: 100px 16% 30px;
  }

  .bold-text {
    font-weight: 600;
  }

  .submit-wrapper {
    position: sticky;
    inset-block-end: 0;
    padding: 20px;
    animation: slide-up 0.5s ease-in-out;

    &.scroll-shadow {
      box-shadow: 0 -1px 6px gray;
    }
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

  oryx-modal [slot='footer'] {
    width: 100%;
    display: flex;
    gap: 10px;
  }

  oryx-modal oryx-button {
    width: 100%;
  }
`;
