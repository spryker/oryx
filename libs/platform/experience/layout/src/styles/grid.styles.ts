import { css } from 'lit';
import { LayoutStyles } from '../layout.model';
import { gridSystem } from './grid-system.styles';

export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-grid-columns: var(--oryx-grid-columns-grid);

      grid-template-columns: repeat(auto-fill, var(--_item-size));
    }
  `,
};
