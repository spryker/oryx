import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const styles = css`
  :host {
    margin: 30px 18px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--gap, 18px);
  }

  .options {
    display: flex;
    align-items: center;
  }

  .options oryx-link {
    margin-inline-start: auto;
  }

  h1 {
    ${headingUtil(HeadingTag.H5)};
  }

  oryx-button {
    align-self: start;
    margin: var(--_login-button-margin, 0);
  }

  oryx-notification {
    margin-block-end: 20px;
  }
`;
