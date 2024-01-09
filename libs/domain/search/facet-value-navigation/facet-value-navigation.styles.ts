import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const facetValueNavigationStyles = css`
  section {
    ${featureVersion >= '1.4' ? css`` : headingUtil(HeadingTag.H6)}

    display: flex;
    align-items: center;
    flex-grow: 1;
  }

  section oryx-button {
    font-size: 1rem;
    margin-inline-start: auto;
  }

  section button,
  slot:not([name]) + oryx-button button {
    color: var(--oryx-color-primary-9);
  }

  oryx-chip {
    margin-inline-start: 10px;
  }

  slot:not([name]) + oryx-button {
    width: fit-content;
    ${featureVersion <= '1.2'
      ? css`
          padding-block-end: 10px;
        `
      : css`
          padding-block-start: 10px;
        `}
  }

  oryx-collapsible {
    width: 100%;
    border: none;
  }

  slot:not([name]) {
    display: block;
    padding-inline: var(--inline-padding);
    padding-block: var(--block-padding);
  }

  oryx-search {
    margin-block-end: 15px;
  }
`;
