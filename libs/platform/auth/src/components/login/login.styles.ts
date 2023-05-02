import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const styles = css`
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
    margin: var(--button-margin, 0);
  }
`;
