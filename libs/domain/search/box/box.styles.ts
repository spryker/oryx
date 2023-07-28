import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { css } from 'lit';

export const searchBoxStyles = css`
  :host {
    --oryx-popover-maxheight: 526px;
    --oryx-icon-size: 16px;
  }

  [slot='option'] {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  section {
    --oryx-icon-size: 24px;

    display: flex;
    flex-direction: column;
    padding-block: 15px 5px;
  }

  section:not(.products) {
    width: 177px;
    margin-inline-end: 5px;
    padding-inline: 15px;
    grid-column: 1;
  }

  section:not(.products) oryx-content-link::part(anchor) {
    padding-block: 6px;
  }

  section.products {
    grid-column: 2;
    grid-row: 1 / span 3;
  }

  section.products oryx-product-card:hover {
    background-color: var(--oryx-color-neutral-3);
  }

  h5 {
    ${headingUtil(HeadingTag.Subtitle)}

    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-block-end: 6px;
  }

  h5:not(:first-child) {
    margin-block-start: 5px;
  }

  section:not(.products) > oryx-content-link {
    color: var(--oryx-color-neutral-9);
    padding-inline-start: 8px;
  }

  oryx-product-card:not(:last-of-type) {
    border-block-end: 2px var(--oryx-color-divider, var(--oryx-color-neutral-6))
      solid;
  }

  section.products oryx-content-link {
    align-self: center;
    margin-block: 15px 23px;
  }

  div[slot='empty'] {
    padding-block: 18px;
    padding-inline: 15px;
    color: var(--oryx-color-neutral-9);
  }

  oryx-typeahead {
    z-index: 1;
  }

  oryx-typeahead::before {
    content: '';
    position: fixed;
    inset: 0;
    height: 100%;
    width: 100%;
    background-color: var(--oryx-color-neutral-12);
    transition: opacity var(--oryx-transition-time);
    pointer-events: none;
    opacity: 0;
  }

  oryx-typeahead[open]::before {
    opacity: 0.3;
  }
`;
