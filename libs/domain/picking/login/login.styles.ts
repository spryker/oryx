import { css } from 'lit';

export const loginComponentStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100vh;
  }

  oryx-image {
    display: inherit;
    height: 82px;
  }

  oryx-heading {
    align-self: center;
    margin-block: 50px;
    margin-block-start: 30px;
    text-align: center;
    margin-inline: 18px;
  }

  h3 {
    --h3s: 18px;
    --h3l: 26px;
  }

  oryx-auth-login {
    --_login-button-margin: 8px 0 0 0;
    --gap: 22px;
  }
`;
