import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  base: css`
    :host {
      --oryx-grid-columns: var(--oryx-grid-columns-grid);
    }

    :host([layout='grid']) {
      grid-template-columns: repeat(auto-fill, var(--_item-size));
    }
  `,
  lg: {
    styles: css`
      :host([layout-lg='grid']) {
        grid-template-columns: repeat(auto-fill, var(--_item-size));
      }
    `,
  },
  md: {
    styles: css`
      :host([layout-md='grid']) {
        grid-template-columns: repeat(auto-fill, var(--_item-size));
      }
    `,
  },
  sm: {
    styles: css`
      :host([layout-sm='grid']) {
        grid-template-columns: repeat(auto-fill, var(--_item-size));
      }
    `,
  },
};
