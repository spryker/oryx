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

  .picked-items-info {
    font-weight: 600;
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
