import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const searchFacetNavigationStyles = css`
  :host {
    --oryx-collapsible-border: none;

    align-items: stretch;
    max-height: 100vh;
    overflow-y: auto;
    ${featureVersion >= '1.4'
      ? css`
          padding: 1px;
        `
      : css``}
  }

  ${featureVersion >= '1.4'
    ? css`
        :host > * {
          transition: background-color var(--oryx-transition-time);
        }

        :host > *:hover {
          background: var(--oryx-color-neutral-2);
        }

        :host > *:active {
          background: var(--oryx-color-neutral-3);
        }
      `
    : css``}
`;
