import { css } from 'lit';
import { LayoutStyles } from '../../../../layout/src/layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host,
    ::slotted([class*='sticky']) {
      position: sticky;
      inset-block-start: var(--top, 0);
      max-height: calc(var(--height, 100vh) - var(--top, 0px));
      z-index: var(--z-index, 1);
    }
  `,
};
