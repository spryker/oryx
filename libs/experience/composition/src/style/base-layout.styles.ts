import { css } from 'lit';

export const baseLayoutStyles = css`
  @layer layout {
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--oryx-layout-gap);
      align-items: flex-start;
      width: 100%;
    }

    :host,
    :host([class*='-layout-']) > * {
      box-sizing: border-box;
      padding: var(--oryx-layout-padding, 0);
      margin: var(--oryx-layout-margin, 0);
      min-width: 0;
    }

    :host([class*='-layout-']) > * {
      width: calc(100% - (var(--oryx-layout-margin, 0px) * 2));
      height: calc(
        var(--oryx-layout-height, 100%) - (var(--oryx-layout-margin, 0px) * 2)
      );
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
