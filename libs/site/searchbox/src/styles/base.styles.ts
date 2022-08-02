import { css } from 'lit';

export const baseSearchboxStyles = css`
  oryx-typeahead {
    --oryx-popover-maxheight: 480px;
    --oryx-border-radius: 2px;
    --oryx-popover-vertical-offset: 0;
    --oryx-popover-distance: 62px;

    max-width: 400px;
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
    margin-bottom: 20px;
  }

  section {
    padding: 20px;
  }

  section:first-child:not(:only-child) {
    padding-bottom: 0;
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
    top: 0;
  }

  [slot='option']::after {
    bottom: 0;
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
    padding-block: 5px;
    padding-inline: 65px 5px;
    text-decoration: none;
    min-height: 60px;
    box-sizing: border-box;
    margin-bottom: 5px;
  }

  product-media {
    --image-max-width: 50px;
    --image-max-height: 50px;

    position: absolute;
    top: 5px;
    inset-inline-start: 5px;
  }

  /* TODO: make alignments with required screen width for mobile */
  @media (min-width: 769px) {
    :host([stretched]) {
      --oryx-popover-width: auto;
    }

    oryx-typeahead {
      --oryx-popover-distance: 48px;
    }

    oryx-icon-button[slot='suffix'] {
      display: none;
    }

    :host([stretched]) [slot='option'] > * {
      min-width: 530px;
      display: flex;
    }

    section {
      flex: 1 1 auto;
    }

    section:first-child:not(:only-child) {
      padding-bottom: 20px;
    }
  }
`;
