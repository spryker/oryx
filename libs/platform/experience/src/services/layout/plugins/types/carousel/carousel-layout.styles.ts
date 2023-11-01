import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';
import { gridSystem } from '../../grid-system.styles';

// TODO: support multi-row carousels by using template rows
// grid-template-rows: repeat(2, auto);
export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-column-count: var(--oryx-column-grid);
      --indicator-area-height: 50px;

      grid-auto-flow: column;
      overflow: var(--_scroll, auto) hidden;
      overscroll-behavior-x: contain;
      scroll-snap-type: both mandatory;
      grid-auto-columns: var(--_item-size);

      /* scroll-behavior: smooth; */
    }

    /* :host([indicatorsPosition='below']) {
      isolation: isolate;
      margin-block-end: var(--indicator-area-height);
    } */

    @media (hover: hover) {
      :host {
        --_scroll: var(--scroll-with-mouse);
      }
    }

    @media (hover: none) {
      :host {
        --_scroll: var(--scroll-with-touch);
      }
    }

    :host::-webkit-scrollbar {
      display: none;
    }

    /* *,
    ::slotted(*) {
      scroll-snap-align: start;
    } */

    @media (prefers-reduced-motion: reduce) {
      :host {
        scroll-behavior: auto;
      }
    }
  `,
};

export const verticalStyles: LayoutStyles = {
  styles: css`
    :host {
      grid-auto-flow: row;
      overflow: hidden var(--_scroll, auto);
    }
  `,
};
