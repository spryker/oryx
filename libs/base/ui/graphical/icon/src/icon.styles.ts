import { Size } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

export const defaultIconFont = 'Material Symbols Outlined';

const smallSize = unsafeCSS(`[size='${Size.Sm}']`);
const mediumSize = unsafeCSS(`[size='${Size.Md}']`);
const font = unsafeCSS(defaultIconFont);

export const styles = css`
  :host {
    /* stylelint-disable-next-line */
    --_margin: 0px;

    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--oryx-icon-size, var(--oryx-icon-size-lg, 24px));
    aspect-ratio: 1 / 1;
    color: var(--oryx-icon-color, inherit);
    font: var(--oryx-icon-weight, 500)
      var(--oryx-icon-size, var(--_oryx-icon-size, 24px))
      var(--oryx-icon-font, ${font});
    font-variation-settings: 'FILL' var(--oryx-icon-fill, 0),
      'wght' var(--oryx-icon-weight, 500), 'GRAD' var(--oryx-icon-grad, 0),
      'opsz' var(--oryx-icon-optical, 48);
    -webkit-font-smoothing: antialiased;
  }

  svg,
  ::slotted(svg) {
    fill: var(--oryx-icon-color, currentColor);
    width: calc(var(--oryx-icon-size, 24px) - (var(--_margin) * 2));
    aspect-ratio: 1 / 1;
    margin: var(--_margin);
  }

  :host(${mediumSize}) {
    --_margin: 2px;
    --_oryx-icon-size: 20px;
  }

  :host(${smallSize}) {
    --_margin: 4px;
    --_oryx-icon-size: 13.3px;
  }
`;
