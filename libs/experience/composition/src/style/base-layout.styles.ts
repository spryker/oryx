import { css } from 'lit';

export const baseLayoutStyles = css`
  @layer layout {
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--oryx-layout-gap);
      align-items: flex-start;
      box-sizing: border-box;
      min-width: 0;
      width: 100%;
    }

    :host([class*='-layout-']) > * {
      height: var(--oryx-layout-height, 0%);
      box-sizing: border-box;
    }

    @media (min-width: 768px) {
      :host {
        --oryx-layout-item-count: 2;
      }
    }

    @media (min-width: 1024px) {
      :host {
        --oryx-layout-item-count: 4;
      }
    }
  }
`;
