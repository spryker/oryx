import { css } from 'lit';

export const styles = css`
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
    margin-bottom: 50px;
    margin-top: 30px;
  }

  h3 {
    --h3s: 18px;
    --h3l: 26px;
  }

  oryx-auth-login {
    --button-margin: 8px 0 0 0;
    --login-gap: 22px;
  }
`;
