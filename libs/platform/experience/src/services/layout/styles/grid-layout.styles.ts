import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
import { gridSystem } from './grid-system.styles';

export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-grid-columns: var(--oryx-column-grid);
    }

    :host(:not([vertical])) {
      grid-template-columns: repeat(auto-fill, var(--_item-size));
    }

    :host([vertical]) {
      grid-auto-flow: column;
      grid-template-rows: repeat(auto-fill, var(--_item-size));
      grid-auto-columns: var(--_item-size);
    }
  `,
};
