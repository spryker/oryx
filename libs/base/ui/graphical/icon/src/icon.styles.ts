import { css, unsafeCSS } from 'lit';

export const defaultIconFont = 'Material Symbols Outlined';

const font = unsafeCSS(defaultIconFont);

export const styles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--oryx-icon-size, var(--_size, 24px));
    width: var(--oryx-icon-size, var(--_size, 24px));
    color: var(--oryx-icon-color, inherit);
    font: var(--oryx-icon-weight, 500) var(--oryx-icon-size, var(--_size, 24px))
      var(--oryx-icon-font, ${font});
    font-variation-settings: 'FILL' var(--oryx-icon-fill, 0),
      'wght' var(--oryx-icon-weight, 500), 'GRAD' var(--oryx-icon-grad, 0),
      'opsz' var(--oryx-icon-optical, 48);
    -webkit-font-smoothing: antialiased;
  }

  :host([direction]:dir(rtl)) {
    transform: scaleX(-1);
  }

  svg,
  ::slotted(svg) {
    fill: var(--oryx-icon-color, currentColor);
    width: var(--oryx-icon-size, var(--_size, 24px));
    aspect-ratio: 1 / 1;
    margin: var(--_margin, 0);
  }

  :host([size='md']) {
    --_size: 20px;
    --_margin: 2px;
  }

  :host([size='sm']) {
    --_size: 16px;
    --_margin: 4px;
  }
`;
