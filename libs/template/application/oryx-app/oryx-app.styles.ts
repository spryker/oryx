import { featureVersion } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: var(--oryx-typography-body-font);
    font-weight: var(--oryx-typography-body-weight);
    line-height: var(--oryx-typography-body-line);
    letter-spacing: 0.005em;
    color: var(--oryx-color-neutral-12);
    background-color: var(--oryx-color-neutral-1);
    min-height: 100vh;
    box-sizing: border-box;
    ${featureVersion <= '1.3'
      ? unsafeCSS('text-wrap: balance;')
      : unsafeCSS('')}
  }

  ::placeholder {
    color: var(--oryx-color-placeholder);
  }
`;
