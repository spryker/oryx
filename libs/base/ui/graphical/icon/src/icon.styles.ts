import { Size } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

const smallSize = unsafeCSS(`[size='${Size.Sm}']`);
const mediumSize = unsafeCSS(`[size='${Size.Md}']`);

export const styles = css`
  :host {
    --_margin: 0;

    display: flex;
    align-items: center;
    height: var(--oryx-icon-size, var(--oryx-icon-size-large, 24px));
    aspect-ratio: 1 / 1;
    color: var(--oryx-icon-color, inherit);
    font-size: var(--oryx-icon-size, 24px);
    font-family: var(--icon-font, 'Material Symbols Outlined');
    font-variation-settings: 'FILL' var(--icon-fill, 0),
      'wght' var(--icon-weight, 500), 'GRAD' var(--icon-grad, 0),
      'opsz' var(--icon-optical, 48);
    -webkit-font-smoothing: antialiased;
  }

  svg,
  ::slotted(svg) {
    fill: var(--oryx-icon-color, currentColor);
    width: calc(var(--oryx-icon-size, 24px) - (var(--_margin, 0) * 2));
    aspect-ratio: 1 / 1;
    margin: var(--_margin, 0);
    transition: var(--oryx-transition-time);
  }

  :host(${mediumSize}) {
    --_margin: 2px;
  }

  :host(${smallSize}) {
    --_margin: 4px;
  }
`;
