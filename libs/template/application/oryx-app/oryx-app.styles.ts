import { featureVersion } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

export const styles = css`
  :host {
    ${unsafeCSS(
      featureVersion >= '1.4'
        ? `
        --_container-width: min(
          var(--oryx-container-width),
          calc(100vw - (2 * var(--oryx-container-bleed, 0px)))
        );
    `
        : ''
    )}

    display: block;
    font-family: var(--oryx-typography-body-font);
    font-weight: var(--oryx-typography-body-weight);
    line-height: var(--oryx-typography-body-line);
    letter-spacing: 0.005em;
    color: var(--oryx-color-neutral-12);
    background-color: var(--oryx-color-neutral-1);
    min-height: 100vh;
    box-sizing: border-box;
    ${unsafeCSS(featureVersion >= '1.4' ? '' : 'text-wrap: balance;')}
  }

  ::placeholder {
    color: var(--oryx-color-placeholder);
  }
`;
