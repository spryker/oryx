import { featureVersion } from '@spryker-oryx/utilities';
import { css, unsafeCSS } from 'lit';

const padding =
  featureVersion >= '1.4'
    ? unsafeCSS(``)
    : css`
        :host {
          padding: 4px 1px;
        }
      `;

export const searchFacetStyles = css`
  ${padding}

  ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-block: 0;
    padding-inline-start: 0;
    list-style-type: none;
  }

  ul ul {
    padding-block-start: 10px;
    padding-inline-start: 25px;
  }

  input + div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  input + div > *:first-child {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
