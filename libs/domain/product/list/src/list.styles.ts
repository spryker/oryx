import { css } from 'lit';

export const styles = css`
  :host(:not(:is([layout], [layout-sm], [layout-md], [layout-lg]))) {
    display: contents;
  }
`;
