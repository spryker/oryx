import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const linkStyles = css`
  a {
    width: 100%;
  }
`;

const smallScreen = css`
  :host {
    display: block;
    position: sticky;
    inset-block-end: 0;
    padding: 10px;
    background: var(--oryx-color-neutral-1);
  }
`;

export const checkoutLinkScreenStyles = screenCss({
  sm: smallScreen,
});
