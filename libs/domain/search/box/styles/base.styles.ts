import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const baseStyles = css`
  :host([stretched]) {
    --oryx-popover-width: auto;
  }

  oryx-typeahead {
    --oryx-popover-maxheight: 480px;
    --oryx-popover-vertical-offset: 0;
    --oryx-popover-distance: 48px;
  }

  :host([stretched]) [slot='option'] > * {
    min-width: 530px;
    display: flex;
  }

  [slot='option'] {
    position: relative;
    display: flex;
    overflow: hidden;
  }

  [slot='option'] > * {
    position: relative;
    align-items: flex-start;
    flex-grow: 1;
    overflow: auto;
  }

  h5 {
    font-size: 16px;
    font-weight: var(--oryx-font-medium);
  }

  h5,
  li:not(:last-child) {
    margin: 0 0 10px;
  }

  ul {
    list-style: none;
    padding-inline: 0;
    margin: 0;
  }

  ul:not(:last-child) {
    margin-block-end: 20px;
  }

  section {
    flex: 1 1 auto;
    padding: 20px;
  }

  section:first-child:not(:only-child) {
    padding-block-end: 20px;
  }

  [slot='empty'] {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8f8f8f;
    padding: 30px;
    box-sizing: border-box;
  }

  [slot='empty'] oryx-icon {
    color: #b2b2b2;
  }

  [slot='empty'] span {
    font-weight: 400;
    line-height: 17px;
    margin-inline-start: 10px;
  }

  [slot='option']::before,
  [slot='option']::after {
    display: none;
    content: '';
    position: absolute;
    inset-inline-start: 0;
    width: 100%;
    z-index: 1;
  }

  [slot='option']::before {
    inset-block-start: 0;
  }

  [slot='option']::after {
    inset-block-end: 0;
  }

  :host([scrollable-top]) [slot='option']::before,
  :host([scrollable-bottom]) [slot='option']::after {
    display: block;
  }

  oryx-typeahead:not([open]) oryx-icon-button[slot='suffix'] {
    display: none;
  }

  .product {
    position: relative;
    display: block;
    padding-inline: 65px 5px;
    text-decoration: none;
    box-sizing: border-box;
  }

  oryx-product-media {
    --image-max-width: 50px;
    --image-max-height: 50px;

    position: absolute;
    inset-block-start: 5px;
    inset-inline-start: 5px;
  }

  oryx-icon-button[slot='suffix'] {
    display: none;
  }

  oryx-product-price,
  oryx-product-price::part(sales),
  oryx-product-price::part(original) {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    grid-column: initial;
  }
`;

const smallScreen = css`
  oryx-typeahead {
    --oryx-popover-distance: 62px;
  }

  :host([stretched]) [slot='option'] > * {
    min-width: initial;
  }

  section:first-child:not(:only-child) {
    padding-block-end: 0;
  }
`;

export const screenStyles = screenCss({
  sm: smallScreen,
});
