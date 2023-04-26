import { Size } from '@spryker-oryx/ui';
import { css, unsafeCSS } from 'lit';

const smallSize = unsafeCSS(`[size='${Size.Sm}']`);
const mediumSize = unsafeCSS(`[size='${Size.Md}']`);
const xLargeSize = unsafeCSS(`[size='${Size.Xl}']`);

export const styles = css`
  :host {
    /* stylelint-disable-next-line */
    --_margin: 0px;

    display: flex;
    height: var(--oryx-icon-size, var(--oryx-icon-size-xlarge, 32px));
    aspect-ratio: 1 / 1;
    justify-content: center;
    color: var(--oryx-icon-color, inherit);
  }

  svg,
  ::slotted(svg) {
    fill: var(--oryx-icon-color, currentColor);
    width: calc(var(--oryx-icon-size, 24px) - (var(--_margin) * 2));
    aspect-ratio: 1 / 1;
    margin: var(--_margin);
    transition: var(--oryx-transition-time);
  }

  :host(${mediumSize}) {
    --_margin: 2px;
  }

  :host(${smallSize}) {
    --_margin: 4px;
  }

  :host(${xLargeSize}) {
    --_margin: -8px;
  }
`;
