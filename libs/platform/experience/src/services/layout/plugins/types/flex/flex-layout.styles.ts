import { css } from 'lit';
import { LayoutStyles } from '../../../layout.model';

export const styles: LayoutStyles = {
  styles: css`
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: var(--align, normal);
      justify-content: var(--justify, flex-start);
    }
  `,
};

export const verticalStyles: LayoutStyles = {
  styles: css`
    :host {
      flex-direction: column;
    }
  `,
};
