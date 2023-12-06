import { css } from 'lit';

/**
 * @deprecated since 1.4, use headingStyles instead. The name is changed, but more importantly
 * the styles rules have been heavily refactored.
 */
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
    --smalls: var(--oryx-typography-small-size);
    --smallw: var(--oryx-typography-small-weight);
    --smalll: var(--oryx-typography-small-line);

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

  :host([style*='--max-lines']) > *:not(style),
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
  :host([as='.caption']) {
    --fs: var(--caps);
    --fw: var(--capw);
    --lh: var(--capl);
  }

  small,
  ::slotted(small),
  :host([as='small']) {
    --fs: var(--smalls);
    --fw: var(--smallw);
    --lh: var(--smalll);
  }
`;
