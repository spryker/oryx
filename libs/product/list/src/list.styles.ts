import { css } from 'lit';

export const ProductListStyles = css`
  :host {
    padding-inline: 4px;
    scroll-padding-inline: 4px;
  }

  @media (max-width: 767px) {
    :host(.xs-layout-carousel) {
      padding-bottom: 12px;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    :host(.md-layout-carousel) {
      padding-bottom: 12px;
    }
  }

  :host(.xl-layout-carousel) {
    padding-bottom: 12px;
  }
`;
