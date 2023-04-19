import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  base: css``,
  styles: css`
    :host([sticky]),
    ::slotted(*[sticky]),
    ::slotted([class*='sticky']) {
      position: sticky;
      inset-block-start: var(--top, 0);
      max-height: calc(var(--height, 100vh) - var(--top, 0px));
      z-index: var(--z-index, 1);
    }
  `,
  lg: {
    styles: css`
      :host([sticky-lg]),
      ::slotted(*[sticky-lg]),
      ::slotted([class*='sticky-lg']) {
        position: sticky;
        inset-block-start: var(--top, 0);
        max-height: calc(var(--height, 100vh) - var(--top, 0px));
        z-index: var(--z-index, 1);
      }
    `,
  },
  md: {
    styles: css`
      :host([sticky-md]),
      ::slotted(*[sticky-md]),
      ::slotted([class*='sticky-md']) {
        position: sticky;
        inset-block-start: var(--top, 0);
        max-height: calc(var(--height, 100vh) - var(--top, 0px));
        z-index: var(--z-index, 1);
      }
    `,
  },
  sm: {
    styles: css`
      :host([sticky-sm]),
      ::slotted(*[sticky-sm]),
      ::slotted([class*='sticky-sm']) {
        position: sticky;
        inset-block-start: var(--top, 0);
        max-height: calc(var(--height, 100vh) - var(--top, 0px));
        z-index: var(--z-index, 1);
      }
    `,
  },
};
