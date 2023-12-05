import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host > *,
    :host ::slotted(*) {
      transition: all var(--oryx-transition-time);
    }
  `,
};
