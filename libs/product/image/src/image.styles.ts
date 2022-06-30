import { css, unsafeCSS } from 'lit';
import {
  ProductImageNavigationDisplay,
  ProductImageNavigationLayout,
  ProductImageNavigationPosition,
  ProductImagePreviewLayout,
} from './image.model';

const layout = {
  grid: unsafeCSS(ProductImageNavigationLayout.GRID),
  float: unsafeCSS(ProductImageNavigationPosition.FLOATING),
  aside: unsafeCSS(ProductImageNavigationDisplay.ASIDE),
  toggle: unsafeCSS(ProductImagePreviewLayout.TOGGLE),
};

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
  }

  section {
    order: 1;
    height: var(--preview-height, 300px);
    overflow: auto;
    scroll-snap-type: both mandatory;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-grow: 1;
    background-color: var(--oryx-color-neutral-dark, gray);
    scrollbar-width: none; /* Firefox */
  }

  section::-webkit-scrollbar,
  .nav::-webkit-scrollbar {
    display: none;
  }

  section > picture {
    flex: 1 0 100%;
    scroll-snap-align: start;
    padding: var(--preview-padding, 24px);
    box-sizing: border-box;

    /* Prevents collapsing for elements with 0 height */
    min-height: 1px;
  }

  section img {
    width: 100%;
    height: 100%;
    object-fit: var(--preview-fit, contain);
  }

  .nav {
    all: unset;
    flex: auto;
    margin: auto;
    max-width: 100%;
    display: flex;
    order: 1;
    z-index: 1;
    flex-shrink: 0;
    box-sizing: border-box;
    min-inline-size: auto;
    padding-block: var(--navigation-padding, 8px);
    position: relative;
    flex-direction: var(--navigation-direction, row);
    gap: var(--navigation-gap, 1rem);
    overflow: auto;
    scroll-behavior: smooth;
    scroll-snap-type: both mandatory;
    scrollbar-width: none; /* Firefox */
    -webkit-overflow-scrolling: touch;
  }

  .nav input {
    appearance: none;
    /* stylelint-disable-next-line */
    -webkit-appearance: none; /* Safari */
    margin: 0;
    inset: 0;
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .nav input:focus-visible {
    outline-color: var(--oryx-color-neutral-dark, gray);
  }

  .nav-item {
    display: flex;
    position: relative;
  }

  .nav-item > img {
    border: var(--oryx-border-thin) solid transparent;
    cursor: pointer;
    opacity: 50%;
    transition: all 0.35s ease;
    padding: 0;
    transition-property: opacity, border-color;
    pointer-events: all;
    object-fit: var(--navigation-fit, cover);
  }

  .nav-item > img:hover,
  .nav-item > img.active,
  .nav-item > input:checked + img,
  .nav-item > input:focus + img {
    opacity: 100%;
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([nav-position='${layout.float}']) {
    position: relative;
  }

  :host([nav-display='${layout.aside}']) {
    flex-direction: row;
  }

  :host([nav-position='${layout.float}']) .nav {
    position: absolute;
    padding: var(--navigation-padding, 8px);
    top: auto;
    bottom: 0;
    transform: translateX(-50%);
    inset-inline-start: 50%;
  }

  :host([dir='rtl'][nav-position='${layout.float}']) .nav {
    transform: translateX(50%);
  }

  :host([nav-display='${layout.aside}']) .nav {
    order: 0;
    padding-inline: var(--navigation-padding, 8px);
    max-height: var(--preview-height, 300px);
    inset-inline: auto;
    writing-mode: vertical-lr;
    flex-direction: row;
  }

  :host([nav-display='${layout.aside}']) section {
    flex-basis: 100%;
  }

  :host([layout='${layout.toggle}']) section {
    position: relative;
  }

  :host([layout='${layout.toggle}']) section > picture {
    position: absolute;
    inset: 0;
    opacity: 0%;
    transition: opacity var(--oryx-transition-time) ease;
  }

  :host([layout='${layout.toggle}']) section > picture.active {
    opacity: 100%;
  }

  :host([nav-layout='${layout.grid}']) .nav {
    flex-wrap: wrap;
  }

  :host([nav-layout='${layout.grid}'][nav-position='${layout.float}'][nav-display='${layout.aside}'])
    .nav {
    inset-block-end: auto;
    top: 0;
  }

  :host([nav-display='${layout.aside}'][nav-position='${layout.float}']) .nav {
    padding: var(--navigation-padding, 8px);
    transform: translateY(-50%);
    top: 50%;
  }

  :host([nav-layout='${layout.grid}'][nav-position='${layout.float}']) .nav {
    inset: 0;
    top: auto;
    justify-content: center;
    transform: none;
    min-inline-size: fit-content;
  }
`;
