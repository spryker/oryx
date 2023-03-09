import { ThemeStylesWithMedia } from '@spryker-oryx/core';
import { lgScreen, mdScreen, smScreen } from '@spryker-oryx/themes/breakpoints';
import { css } from 'lit';

export const headlineStyles = css`
  :host {
    --h1s: var(--oryx-typography-h1-size);
    --h1w: var(--oryx-typography-h1-weight);
    --h1l: var(--oryx-typography-h1-line);
    --h2s: var(--oryx-typography-h2-size);
    --h2w: var(--oryx-typography-h2-weight);
    --h2l: var(--oryx-typography-h2-line);
    --h3s: var(--oryx-typography-h3-size);
    --h3w: var(--oryx-typography-h3-weight);
    --h3l: var(--oryx-typography-h3-line);
    --h4s: var(--oryx-typography-h4-size);
    --h4w: var(--oryx-typography-h4-weight);
    --h4l: var(--oryx-typography-h4-line);
    --h5s: var(--oryx-typography-h5-size);
    --h5w: var(--oryx-typography-h5-weight);
    --h5l: var(--oryx-typography-h5-line);
    --h6s: var(--oryx-typography-h6-size);
    --h6w: var(--oryx-typography-h6-weight);
    --h6l: var(--oryx-typography-h6-line);
    --subs: var(--oryx-typography-subtitle-size);
    --subw: var(--oryx-typography-subtitle-weight);
    --subl: var(--oryx-typography-subtitle-line);
    --caps: var(--oryx-typography-caption-size);
    --capw: var(--oryx-typography-caption-weight);
    --capl: var(--oryx-typography-caption-line);

    display: var(--display, block);
  }

  :host,
  :host > *,
  ::slotted(*:not(oryx-content-link)) {
    font-size: var(--fs);
    font-weight: var(--fw);
    line-height: var(--lh);
  }

  :host > *,
  ::slotted(*) {
    margin-block: 0;
  }

  :host([style*='--max-lines']) > *,
  :host([style*='--max-lines']) ::slotted(*) {
    max-height: calc(var(--_line-height) * var(--max-lines));
    transition: max-height 2s;
    display: var(--display, -webkit-box);
    overflow: hidden;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
  }

  :host([as]:not([as='hide'])) > *,
  :host([as]:not([as='hide'])) > ::slotted(*) {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  :host([as='hide']) {
    display: none;
  }

  h1,
  ::slotted(h1),
  :host([as='h1']) {
    --fs: var(--h1s);
    --fw: var(--h1w);
    --lh: var(--h1l);
  }

  h2,
  ::slotted(h2),
  :host([as='h2']) {
    --fs: var(--h2s);
    --fw: var(--h2w);
    --lh: var(--h2l);
  }

  h3,
  ::slotted(h3),
  :host([as='h3']) {
    --fs: var(--h3s);
    --fw: var(--h3w);
    --lh: var(--h3l);
  }

  h4,
  ::slotted(h4),
  :host([as='h4']) {
    --fs: var(--h4s);
    --fw: var(--h4w);
    --lh: var(--h4l);
  }

  h5,
  ::slotted(h5),
  :host([as='h5']) {
    --fs: var(--h5s);
    --fw: var(--h5w);
    --lh: var(--h5l);
  }

  h6,
  ::slotted(h6),
  :host([as='h6']) {
    --fs: var(--h6s);
    --fw: var(--h6w);
    --lh: var(--h6l);
  }

  .subtitle,
  ::slotted(.subtitle),
  :host([as='.subtitle']) {
    --fs: var(--subs);
    --fw: var(--subw);
    --lh: var(--subl);

    text-transform: uppercase;
  }

  .caption,
  ::slotted(.caption),
  :host([as='.subtitle']) {
    --fs: var(--caps);
    --fw: var(--capw);
    --lh: var(--capl);
  }
`;

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
`;

export const headlineScreenStyles: ThemeStylesWithMedia[] = [
  {
    media: smScreen,
    css: smallScreen,
  },
  {
    media: mdScreen,
    css: mediumScreen,
  },
  {
    media: lgScreen,
    css: largeScreen,
  },
];
