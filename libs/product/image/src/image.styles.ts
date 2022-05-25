import { css, unsafeCSS } from 'lit';
import { ProductImageThumbsPosition } from './image.model';

export const styles = css`
  :host {
    display: flex;
    flex-direction: column;
  }

  section {
    order: 1;
    height: var(--preview-height, 300px);
    overflow: auto;
    scroll-behavior: smooth;
    scroll-snap-type: both mandatory;
    -webkit-overflow-scrolling: touch;
    display: flex;
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
    margin: auto;
    max-width: 100%;
    order: 1;
    flex-shrink: 0;
    min-inline-size: auto;
    padding: var(--oryx-space, 4px) 0;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: var(--navigation-direction, row);
    gap: var(--navigation-gap, 1rem);
    overflow: auto;
    scroll-behavior: smooth;
    scroll-snap-type: both mandatory;
    scrollbar-width: thin; /* Firefox */
    -webkit-overflow-scrolling: touch;
  }

  .nav input {
    appearance: none;
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

  :host([nav-position='${unsafeCSS(ProductImageThumbsPosition.FLOATING)}']) {
    position: relative;
  }

  :host([nav-position='${unsafeCSS(ProductImageThumbsPosition.FLOATING)}'])
    .nav {
    position: absolute;
    padding: var(--navigation-padding, 20px);
    top: auto;
    bottom: 0;
    inset-inline-start: 0;
    inset-inline-end: 0;
  }

  :host([nav-display='aside']) {
    flex-direction: row;
  }

  :host([nav-display='aside']) .nav {
    top: 0;
    bottom: 0;
    order: 0;
    inset-inline-start: 0;
    inset-inline-end: auto;
    flex-direction: column;
    padding: 0 var(--oryx-space, 4px);
    max-height: var(--preview-height, 300px);
  }

  :host([layout='toggle']) section {
    position: relative;
  }

  :host([layout='toggle']) section > picture {
    position: absolute;
    inset: 0;
    opacity: 0%;
    transition: opacity var(--oryx-transition-time) ease;
  }

  :host([layout='toggle']) section > picture.active {
    opacity: 100%;
  }

  :host([nav-layout='grid']) .nav {
    flex-wrap: wrap;
  }
`;
