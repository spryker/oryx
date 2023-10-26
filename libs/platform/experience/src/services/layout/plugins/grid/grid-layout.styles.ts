import { css } from 'lit';
import { LayoutStyles } from '../../layout.model';
import { gridSystem } from '../grid-system.styles';

export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-column-count: var(--oryx-column-grid);
    }

    :host(:not([layout-vertical])) {
      grid-template-columns: repeat(auto-fill, var(--_item-size));
    }

    :host([layout-vertical]) {
      grid-auto-flow: column;
      grid-template-rows: repeat(auto-fill, var(--_item-size));
      grid-auto-columns: var(--_item-size);
    }
  `,
};
