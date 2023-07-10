import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: flex;
      flex-wrap: wrap;
    }

    :host(:not([layout-vertical])) {
      align-items: var(--align, start);
      justify-content: var(--justify, start);
    }

    :host([layout-vertical]) {
      flex-direction: column;
    }
  `,
};

// Align vertically:
// align-items: center;

// justify-items: var(--align); // align items horizontally within a container
// justify-content: var(--align); //  align the columns within a container

// align-items: var(--align, stretch); // align items vertically within a container
// align-content: var(--align, start); // vertically when there is extra space
