import { css } from 'lit';

export const ProductCardStyles = css`
  :host {
    transition: all var(--oryx-transition-time);
    background-color: var(--oryx-color-canvas);
    min-height: calc(
      408px -
        calc(
          var(--_title-offset, 0px) +
            calc(var(--_price-offset, 0px) + var(--_rating-offset, 0px))
        )
    );
    box-sizing: border-box;
    border: var(--oryx-border-thin) solid var(--oryx-color-neutral-dark);
  }

  :host([active]) {
    z-index: 1;
    box-shadow: var(--oryx-elevation-1) var(--oryx-elevation-color-2);
  }

  :host([active]) product-title {
    white-space: normal;
  }

  :host([hide-title]) {
    --_title-offset: 24px;
  }

  :host([hide-price]) {
    --_price-offset: 34px;
  }

  :host([hide-rating]) {
    --_rating-offset: 24px;
  }

  :host,
  content-link,
  content-link::part(wrapper),
  content-link::part(link) {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  content-link,
  content-link::part(wrapper),
  content-link::part(link) {
    width: 100%;
  }

  :host,
  content-link {
    border-radius: var(--oryx-border-radius-small);
  }

  content-link {
    position: relative;
    color: #333;
    text-decoration: none;
    overflow: hidden;
  }

  content-link::part(link) {
    justify-content: flex-end;
    padding: 0;
    border-radius: 0;
    border: none;
    background-color: transparent;
  }

  content-link > div {
    display: flex;
    align-items: flex-start;
    padding-inline: 16px;
    padding-block: 8px;
    justify-content: space-between;
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 250px;
    box-sizing: border-box;
  }

  product-labels,
  oryx-icon-button {
    position: relative;
    z-index: 1;
  }

  oryx-icon-button:first-child {
    margin-inline-start: auto;
  }

  product-labels {
    flex-wrap: wrap;
  }

  button {
    padding: 6px;
    background-color: var(--oryx-color-canvas);
  }

  oryx-icon {
    --oryx-icon-size: 24px;

    color: var(--oryx-color-ink);
  }

  product-media {
    max-height: auto;
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
  }

  product-media::part(fallback) {
    --oryx-icon-size: 100px;

    background: transparent;
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--oryx-color-canvas);
    padding-inline: 16px;
    padding-block: 12px 16px;
    min-height: calc(
      156px -
        calc(
          var(--_title-offset, 0px) +
            calc(var(--_price-offset, 0px) + var(--_rating-offset, 0px))
        )
    );
    position: relative;
  }

  product-title,
  section > div > :not(:last-child) {
    margin-bottom: 8px;
  }

  product-price {
    font-size: 18px;
    line-height: 26px;
    font-weight: 700;
    gap: 4px;
    align-items: center;
  }

  product-price::part(default-original) {
    color: var(--oryx-color-ink);
  }

  product-price::part(original) {
    font-size: 12px;
    line-height: 18px;
    font-weight: 500;
    color: #4c4c4c;
    text-decoration: line-through;
  }

  product-price::part(original)::before {
    display: none;
  }

  product-average-rating {
    --oryx-icon-size: 12px;

    display: block;
  }

  product-title {
    color: var(--oryx-color-ink);
    font-size: 12px;
    line-height: 16px;
    margin-block-end: auto;
    white-space: normal;
  }

  section > div:only-child {
    margin-block-start: auto;
  }
`;
