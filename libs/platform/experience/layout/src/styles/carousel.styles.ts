import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
// TODO: support multi-row carousels by using template rows
// grid-template-rows: repeat(2, auto);

// grid-template-columns: initial;
// scroll-padding-inline-start: var(--scroll-start, 0px);

export const styles: LayoutStyles = {
  base: css`
    :host {
      --oryx-grid-columns: var(--oryx-grid-columns-carousel);

      overflow: auto hidden;
      overscroll-behavior-x: contain;
      scroll-snap-type: both mandatory;
      scroll-behavior: smooth;
    }

    oryx-layout([vertical]) {
      overflow: hidden auto;
    }

    *,
    ::slotted(*) {
      scroll-snap-align: start;
    }

    :host::-webkit-scrollbar {
      display: none;
    }
  `,
  styles: css`
    :host([layout='carousel']) {
      grid-auto-flow: column;
      grid-auto-columns: var(--_item-size);
    }
  `,
  lg: {
    styles: css`
      :host([layout-lg='carousel']) {
        grid-auto-flow: column;
        grid-auto-columns: var(--_item-size);
      }
    `,
  },
  md: {
    styles: css`
      :host([layout-md='carousel']) {
        grid-auto-flow: column;
        grid-auto-columns: var(--_item-size);
      }
    `,
  },
  sm: {
    styles: css`
      :host([layout-sm='carousel']) {
        grid-auto-flow: column;
        grid-auto-columns: var(--_item-size);
      }
    `,
  },
};
