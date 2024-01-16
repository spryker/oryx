import { Size, screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const styles = css`
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
    row-gap: 20px;
  }

  oryx-input,
  oryx-password-input {
    margin-block-start: 10px;
  }

  oryx-link {
    align-items: center;
    justify-content: center;
  }

  oryx-button,
  oryx-action {
    grid-column: var(--oryx-button-span, auto);
  }
`;

export const screenStyles = screenCss({
  [Size.Sm]: css`
    oryx-button {
      grid-column: span 2;
    }
  `,
});
