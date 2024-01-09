import { featureVersion, screenCss } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

const padding =
  featureVersion >= '1.4'
    ? unsafeCSS(``)
    : css`
        :host {
          padding: 4px 1px;
        }
      `;

export const searchRangeFacetStyles = css`
  ${padding}

  input {
    appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
  }

  oryx-search-facet-value-navigation > section {
    display: grid;
    grid-template-columns: 1fr min-content 1fr;
    align-items: center;
    gap: 16px 12px;
  }

  oryx-multi-range {
    grid-column: 1 / span 3;
  }

  hr {
    all: unset;
    width: 8px;
    align-self: end;
    margin-block-end: 22px;
    border-block-start: 2px solid var(--oryx-color-neutral-9);
  }
`;

const largeScreen = css`
  hr {
    margin-block-end: 19px;
  }
`;

export const screenStyles = screenCss({
  lg: largeScreen,
});
