import { css } from 'lit';
import { LayoutStyles } from '../../layout.model';
import { gridSystem } from '../grid-system.styles';

// TODO: support multi-row carousels by using template rows
// grid-template-rows: repeat(2, auto);
export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-column-count: var(--oryx-column-grid);
      --indicator-area-height: 50px;

      isolation: isolate;
      margin-block-end: var(--indicator-area-height);

      overscroll-behavior-x: contain;
      scroll-snap-type: both mandatory;
      scroll-behavior: smooth;
      grid-auto-columns: var(--_item-size);
    }

    :host(:not([layout-vertical])) {
      grid-auto-flow: column;
      overflow: auto hidden;
    }

    :host([layout-vertical]) {
      grid-auto-flow: row;
      overflow: hidden auto;
    }

    :host::-webkit-scrollbar {
      display: none;
    }

    *,
    ::slotted(*) {
      scroll-snap-align: start;
    }
  `,
};

// width: 100%; on slotted causes issues
