import { css } from 'lit';

export const styles = css`
  oryx-modal {
    --oryx-card-header-padding: 18px 30px;
    --oryx-card-body-padding: 18px 30px;
  }

  [slot='heading'] {
    font-size: 18px;
  }

  oryx-button {
    width: 100%;
  }
`;
