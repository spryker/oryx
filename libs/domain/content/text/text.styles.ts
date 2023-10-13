import { css } from 'lit';

export const contentTextStyles = css`
  :host {
    font-size: var(--oryx-typography-size);
    line-height: var(--oryx-typography-line);
    font-weight: var(--oryx-typography-weight);
  }

  :host([overflow]) {
    max-height: calc(var(--oryx-typography-line, 1rem) * var(--max-lines));
    overflow: hidden;
    transition: height var(--oryx-transition-time) ease;
  }

  :host([overflow='clamp']) {
    /* stylelint-disable-next-line */
    display: -webkit-box;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
  }

  :host([overflow='fade']) {
    display: block;
    position: relative;
  }

  :host([overflow='fade'])::before {
    content: '';
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition: opacity var(--oryx-transition-time) ease;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--oryx-color-neutral-1)
    );
    opacity: 0;
  }

  :host([overflow='fade']:not([toggle]))::before {
    opacity: 1;
  }
`;
