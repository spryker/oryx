import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

const compositionPreviewStylesNew = css`
  :host {
    --eb-preview-color: var(--oryx-color-info-9);
    --eb-preview-radius: 4px;
  }

  .eb-preview-focus::before,
  .eb-preview-focus::after {
    position: absolute;
    outline: 4px solid var(--eb-preview-color);
    outline-offset: -4px;
  }

  .eb-preview-focus::before {
    content: '';
    top: calc(var(--ebp-top) - var(--ebp-rel-top, 0px));
    left: calc(var(--ebp-left) - var(--ebp-rel-left, 0px));
    width: var(--ebp-width);
    height: var(--ebp-height);
    border-radius: inherit;
    z-index: var(--oryx-overlay-z-index, 3);
  }

  .eb-preview-focus.ebp-absolute::before,
  .eb-preview-focus.ebp-sticky::before {
    inset-block-start: 0;
    inset-inline-start: 0;
  }

  .eb-preview-focus.ebp-absolute::after,
  .eb-preview-focus.ebp-sticky::after {
    inset-block-start: -26px;
    inset-inline-start: 0;
  }

  .eb-preview-focus::after {
    content: attr(name);
    top: calc(
      var(--ebp-top) - var(--ebp-rel-top, 0px) -
        (26px - var(--eb-preview-radius))
    );
    left: calc(var(--ebp-left) - var(--ebp-rel-left, 0px));
    height: 26px;
    padding: 2px 15px;
    border-radius: var(--eb-preview-radius) var(--eb-preview-radius) 0 0;
    z-index: var(--oryx-overlay-z-index, 3);
    background-color: var(--eb-preview-color);
    font: 500 16px/22px Montserrat, sans-serif;
    color: black;
    box-sizing: border-box;
  }
`;

export const compositionPreviewStylesOld = css`
  .eb-preview-focus {
    position: relative;
  }

  .eb-preview-focus::before {
    content: '';
    outline: 4px solid var(--oryx-color-primary-9);
    outline-offset: -4px;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: var(--oryx-overlay-z-index, 3);
  }

  .eb-preview-focus::after {
    content: attr(name);
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: 0;
    color: #fff;
    font: 500 16px/22px Montserrat, sans-serif;
    padding: 2px 5px;
    background-color: var(--oryx-color-primary-9);
    z-index: var(--oryx-overlay-z-index, 3);
  }
`;

export const compositionPreviewStyles =
  featureVersion >= '1.4'
    ? compositionPreviewStylesNew
    : compositionPreviewStylesOld;
