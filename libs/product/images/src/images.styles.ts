import { css, CSSResult, unsafeCSS } from 'lit';
import {
  ProductImagesNavigationAlignment,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout,
  ProductImagesNavigationPosition,
  ProductImagesPreviewLayout,
} from './images.model';

const getCSSValues = (obj: Record<string, string>): Record<string, CSSResult> =>
  Object.fromEntries(Object.values(obj).map((key) => [key, unsafeCSS(key)]));

const preview = {
  layout: getCSSValues(ProductImagesPreviewLayout),
};

const nav = {
  position: getCSSValues(ProductImagesNavigationPosition),
  display: getCSSValues(ProductImagesNavigationDisplay),
  align: getCSSValues(ProductImagesNavigationAlignment),
  layout: getCSSValues(ProductImagesNavigationLayout),
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
    opacity: 0.5;
    transition: all 0.35s ease;
    padding: 0;
    transition-property: opacity, border-color;
    pointer-events: all;
    object-fit: var(--navigation-fit, cover);
  }

  .nav-item > img.active,
  .nav-item > input:hover + img,
  .nav-item > input:checked + img,
  .nav-item > input:focus + img {
    opacity: 1;
    border-color: var(--oryx-color-neutral-darker);
  }

  :host([nav-display='${nav.display.floating}']) {
    position: relative;
  }

  :host([nav-position='${nav.position.start}']),
  :host([nav-position='${nav.position.end}']) {
    flex-direction: row;
  }

  :host([nav-display='${nav.display.floating}']) .nav {
    position: absolute;
    padding: var(--navigation-padding, 8px);
    top: auto;
    bottom: 0;
  }

  :host([nav-position='${nav.position.start}']) .nav {
    order: 0;
  }

  :host([nav-position='${nav.position.end}']) .nav {
    inset-block-end: 0;
  }

  :host([nav-position='${nav.position.start}']) .nav,
  :host([nav-position='${nav.position.end}']) .nav {
    padding-inline: var(--navigation-padding, 8px);
    max-height: var(--preview-height, 300px);
    inset-inline: auto;
    writing-mode: vertical-lr;
    flex-direction: row;
  }

  :host([dir='rtl'][nav-position='${nav.position.start}']) .nav,
  :host([dir='rtl'][nav-position='${nav.position.end}']) .nav {
    flex-direction: row-reverse;
  }

  :host([nav-position='${nav.position.start}']) section,
  :host([nav-position='${nav.position.end}']) section {
    flex-basis: 100%;
  }

  :host([layout='${preview.layout.toggle}']) section {
    position: relative;
  }

  :host([layout='${preview.layout.toggle}']) section > picture {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity var(--oryx-transition-time) ease;
  }

  :host([layout='${preview.layout.toggle}']) section > picture.active {
    opacity: 1;
  }

  :host([nav-layout='${nav.layout.grid}']) .nav {
    flex-wrap: wrap;
  }

  :host([nav-layout='${nav.layout.grid}'][nav-display='${nav.display
        .floating}'][nav-position='${nav.position.start}'])
    .nav,
  :host([nav-layout='${nav.layout.grid}'][nav-display='${nav.display
        .floating}'][nav-position='${nav.position.end}'])
    .nav {
    inset-block: 0 auto;
  }

  :host([nav-position='${nav.position.end}'][nav-layout='${nav.layout
        .grid}'][nav-display='${nav.display.floating}'])
    .nav,
  :host([dir='rtl'][nav-position='${nav.position.start}'][nav-layout='${nav
        .layout.grid}'][nav-display='${nav.display.floating}'])
    .nav {
    inset-block: auto 0;
  }

  :host([dir='rtl'][nav-display='${nav.display.floating}'][nav-position='${nav
        .position.end}'])
    .nav {
    inset-block: 0 auto;
  }

  :host([nav-position='${nav.position.start}'][nav-display='${nav.display
        .floating}'])
    .nav,
  :host([nav-position='${nav.position.end}'][nav-display='${nav.display
        .floating}'])
    .nav {
    padding: var(--navigation-padding, 8px);
  }

  :host([nav-layout='${nav.layout.grid}'][nav-display='${nav.display
        .floating}'])
    .nav {
    inset: 0;
    top: auto;
    transform: none;
    min-inline-size: fit-content;
  }

  :host([nav-align='${nav.align.start}']) .nav {
    margin-inline-start: 0;
    inset-inline-start: 0;
    justify-content: start;
  }

  :host([nav-align='${nav.align.start}']:not([nav-position='${nav.position
          .below}']))
    .nav {
    top: 0;
  }

  :host([nav-align='${nav.align.center}'][nav-layout='${nav.layout.grid}'])
    .nav {
    justify-content: center;
  }

  :host([nav-align='${nav.align.center}'][nav-display='${nav.display
        .floating}'])
    .nav {
    transform: translateY(-50%);
    inset-inline-start: 50%;
    top: 50%;
  }

  :host([dir='rtl'][nav-align='${nav.align.center}'][nav-display='${nav.display
        .floating}']:not([nav-position='${nav.position.below}']))
    .nav {
    inset-inline-start: auto;
  }

  :host([nav-align='${nav.align.center}'][nav-display='${nav.display
        .floating}'][nav-position='${nav.position.below}'])
    .nav {
    transform: translateX(-50%);
    top: auto;
  }

  :host([dir='rtl'][nav-align='${nav.align.center}'][nav-display='${nav.display
        .floating}'][nav-position='${nav.position.below}'])
    .nav {
    transform: translateX(50%);
  }

  :host([nav-align='${nav.align.end}'][nav-layout='${nav.layout.grid}']) .nav {
    margin-inline-end: 0;
    justify-content: end;
  }

  :host([nav-align='${nav.align.end}'][nav-display='${nav.display.inline}'])
    .nav {
    margin-bottom: 0;
    margin-inline-end: 0;
  }

  :host([nav-align='${nav.align.end}'][nav-display='${nav.display.floating}'])
    .nav {
    inset-inline-end: 0;
  }

  :host([nav-align='${nav.align.end}'][nav-layout='${nav.layout
        .grid}'][nav-position='${nav.position.below}'])
    .nav {
    justify-content: end;
  }
`;
