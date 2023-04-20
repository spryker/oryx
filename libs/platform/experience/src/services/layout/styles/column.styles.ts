import { css } from 'lit';
import { LayoutStyles } from '../../../../layout/src/layout.model';
import { gridSystem } from './grid-system.styles';

export const styles: LayoutStyles = {
  styles: css`
    ${gridSystem}

    :host {
      --oryx-grid-columns: var(--oryx-grid-columns-base);
    }
  `,
};
