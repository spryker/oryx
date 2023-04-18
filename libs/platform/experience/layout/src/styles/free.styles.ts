import { css } from 'lit';
import { LayoutStyles } from '../layout.model';

export const styles: LayoutStyles = {
  base: css`
    :host([layout='free']) {
      display: flex;
    }
  `,
  lg: {
    styles: css`
      :host([layout-lg='free']) {
        display: flex;
      }
    `,
  },
  md: {
    styles: css`
      :host([layout-md='free']) {
        display: flex;
      }
    `,
  },
  sm: {
    styles: css`
      :host([layout-sm='free']) {
        display: flex;
      }
    `,
  },
};
