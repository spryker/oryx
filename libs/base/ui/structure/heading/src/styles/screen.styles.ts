import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

const smallScreen = css`
  :host([as-sm]:not([as-sm='show'])) > *,
  :host([as-sm]:not([as-sm='show'])) > ::slotted(*) {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  :host([as-sm='hide']) {
    --display: none;
  }

  :host([as-sm]:not([as-sm='hide'])) {
    display: initial;
  }

  :host([as-sm='h1']) {
    --fs: var(--h1s);
    --fw: var(--h1w);
    --lh: var(--h1l);
  }

  :host([as-sm='h2']) {
    --fs: var(--h2s);
    --fw: var(--h2w);
    --lh: var(--h2l);
  }

  :host([as-sm='h3']) {
    --fs: var(--h3s);
    --fw: var(--h3w);
    --lh: var(--h3l);
  }

  :host([as-sm='h4']) {
    --fs: var(--h4s);
    --fw: var(--h4w);
    --lh: var(--h4l);
  }

  :host([as-sm='h5']) {
    --fs: var(--h5s);
    --fw: var(--h5w);
    --lh: var(--h5l);
  }

  :host([as-sm='h6']) {
    --fs: var(--h6s);
    --fw: var(--h6w);
    --lh: var(--h6l);
  }

  :host([as-sm='subtitle']) {
    --fs: var(--subs);
    --fw: var(--subw);
    --lh: var(--subl);

    text-transform: uppercase;
  }

  :host([as-sm='caption']) {
    --fs: var(--caps);
    --fw: var(--capw);
    --lh: var(--capl);
  }

  :host([as-sm='small']) {
    --fs: var(--smalls);
    --fw: var(--smallw);
    --lh: var(--smalll);
  }
`;

const mediumScreen = css`
  :host([as-md]:not([as-md='show'])) > *,
  :host([as-md]:not([as-md='show'])) > ::slotted(*) {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  :host([as-md='hide']) {
    --display: none;
  }

  :host([as-md]:not([as-md='hide'])) {
    display: initial;
  }

  :host([as-md='h1']) {
    --fs: var(--h1s);
    --fw: var(--h1w);
    --lh: var(--h1l);
  }

  :host([as-md='h2']) {
    --fs: var(--h2s);
    --fw: var(--h2w);
    --lh: var(--h2l);
  }

  :host([as-md='h3']) {
    --fs: var(--h3s);
    --fw: var(--h3w);
    --lh: var(--h3l);
  }

  :host([as-md='h4']) {
    --fs: var(--h4s);
    --fw: var(--h4w);
    --lh: var(--h4l);
  }

  :host([as-md='h5']) {
    --fs: var(--h5s);
    --fw: var(--h5w);
    --lh: var(--h5l);
  }

  :host([as-md='h6']) {
    --fs: var(--h6s);
    --fw: var(--h6w);
    --lh: var(--h6l);
  }

  :host([as-md='subtitle']) {
    --fs: var(--subs);
    --fw: var(--subw);
    --lh: var(--subl);

    text-transform: uppercase;
  }

  :host([as-md='caption']) {
    --fs: var(--caps);
    --fw: var(--capw);
    --lh: var(--capl);
  }

  :host([as-md='small']) {
    --fs: var(--smalls);
    --fw: var(--smallw);
    --lh: var(--smalll);
  }
`;

const largeScreen = css`
  :host([as-lg]:not([as-lg='show'])) > *,
  :host([as-lg]:not([as-lg='show'])) > ::slotted(*) {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  :host([as-lg='hide']) {
    --display: none;
  }

  :host([as-lg]:not([as-lg='hide'])) {
    display: initial;
  }

  :host([as-lg='h1']) {
    --fs: var(--h1s);
    --fw: var(--h1w);
    --lh: var(--h1l);
  }

  :host([as-lg='h2']) {
    --fs: var(--h2s);
    --fw: var(--h2w);
    --lh: var(--h2l);
  }

  :host([as-lg='h3']) {
    --fs: var(--h3s);
    --fw: var(--h3w);
    --lh: var(--h3l);
  }

  :host([as-lg='h4']) {
    --fs: var(--h4s);
    --fw: var(--h4w);
    --lh: var(--h4l);
  }

  :host([as-lg='h5']) {
    --fs: var(--h5s);
    --fw: var(--h5w);
    --lh: var(--h5l);
  }

  :host([as-lg='h6']) {
    --fs: var(--h6s);
    --fw: var(--h6w);
    --lh: var(--h6l);
  }

  :host([as-lg='subtitle']) {
    --fs: var(--subs);
    --fw: var(--subw);
    --lh: var(--subl);

    text-transform: uppercase;
  }

  :host([as-lg='caption']) {
    --fs: var(--caps);
    --fw: var(--capw);
    --lh: var(--capl);
  }

  :host([as-lg='small']) {
    --fs: var(--smalls);
    --fw: var(--smallw);
    --lh: var(--smalll);
  }
`;

/**
 * @deprecated since 1.4, use headingScreenStyles instead. The name is changed, but more importantly
 * the styles rules have been heavily refactored.
 */
export const headlineScreenStyles = screenCss({
  sm: smallScreen,
  md: mediumScreen,
  lg: largeScreen,
});
