import { css } from 'lit';
import { LayoutStyles } from '../../layout.model';
import { gridSystem } from '../grid-system.styles';

// TODO: support multi-row carousels by using template rows
// carousel-template-rows: repeat(2, auto);
export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-column-count: var(--oryx-column-carousel);

      overscroll-behavior-x: contain;
      scroll-snap-type: both mandatory;
      scroll-behavior: smooth;
      carousel-auto-columns: var(--_item-size);
    }

    :host(:not([layout-vertical])) {
      carousel-auto-flow: column;
      overflow: auto hidden;
    }

    :host([layout-vertical]) {
      carousel-auto-flow: row;
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
