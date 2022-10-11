import { css } from 'lit';

export const baseLayoutStyles = css`
  @layer layout {
    :host {
      --oryx-layout-height: auto;

      display: flex;
      flex-direction: column;
      gap: var(--oryx-layout-gap);
      align-items: flex-start;
      margin: var(--oryx-layout-margin, 0);
      padding: var(--oryx-layout-padding, 0);
    }

    :host,
    :host([class*='-layout-']) > * {
      box-sizing: border-box;
      min-width: 0;
      height: auto;
    }

    :host([class*='-layout-']) > * {
      width: 100%;
      height: var(--oryx-layout-height, 100%);
    }

    :host([class*='-layout-']) > *[class*='has-padding'] {
      padding: var(--oryx-layout-padding, 0);
    }

    :host([class*='-layout-']) > *[class*='has-margin'] {
      margin: var(--oryx-layout-margin, 0);
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
