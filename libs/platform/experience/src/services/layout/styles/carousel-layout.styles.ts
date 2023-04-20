import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
import { gridSystem } from './grid-system.styles';

// TODO: support multi-row carousels by using template rows
// grid-template-rows: repeat(2, auto);
export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-grid-columns: var(--oryx-grid-columns-carousel);

      overflow: auto hidden;
      overscroll-behavior-x: contain;
      scroll-snap-type: both mandatory;
      scroll-behavior: smooth;
      grid-auto-flow: column;
      grid-auto-columns: var(--_item-size);
      scroll-padding-inline-start: var(--scroll-start, 0);
    }

    :host([vertical]) {
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
};
