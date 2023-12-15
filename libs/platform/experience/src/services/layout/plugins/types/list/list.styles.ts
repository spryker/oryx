import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: var(--align);
      align-content: var(--align);
      justify-content: var(--justify);
      justify-items: var(--justify);
    }

    *,
    ::slotted(*) {
      box-sizing: border-box;
    }
  `,
};
