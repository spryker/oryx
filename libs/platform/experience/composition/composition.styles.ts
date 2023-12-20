import { featureVersion } from '@spryker-oryx/utilities';
import { css } from 'lit';

const compositionPreviewStylesNew = css`
  :host {
    --eb-preview-color: var(--oryx-color-info-11);
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
    inset-block-start: calc(var(--ebp-top) - var(--ebp-rel-top, 0px));
    inset-inline-start: calc(var(--ebp-left) - var(--ebp-rel-left, 0px));
    width: var(--ebp-width);
    height: var(--ebp-height);
    border-radius: inherit;
    z-index: var(--oryx-overlay-z-index, 3);
  }

  .eb-preview-focus:is(.ebp-absolute, ebp-sticky)::before {
    inset-block-start: 0;
    inset-inline-start: 0;
  }

  .eb-preview-focus::after {
    content: attr(name);
    inset-block-start: calc(
      var(--ebp-top) - var(--ebp-rel-top, 0px) -
        (26px - var(--eb-preview-radius))
    );
    inset-inline-start: calc(var(--ebp-left) - var(--ebp-rel-left, 0px));
    height: 26px;
    padding: 2px 15px;
    border-radius: var(--eb-preview-radius) var(--eb-preview-radius) 0 0;
    z-index: var(--oryx-overlay-z-index, 3);
    background-color: var(--eb-preview-color);
    font: 500 16px/22px Montserrat, sans-serif;
    color: var(--oryx-color-info-1);
    box-sizing: border-box;
  }

  .eb-preview-focus:is(.ebp-absolute, ebp-sticky)::after {
    inset-block-start: -26px;
    inset-inline-start: 0;
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
