import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host .accordion {
      display: grid;
      gap: var(--oryx-layout-accordion-gap, 8px);
    }

    oryx-composition[bucket='label'] {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,
};
