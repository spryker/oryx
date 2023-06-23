import { ThemeStylesheets } from '@spryker-oryx/experience';
import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { screenCss } from '@spryker-oryx/utilities';
import { css } from 'lit';

export const siteSummaryPriceStyles = css`
  :host {
    display: grid;
    grid-template-columns: 1fr max-content;
    padding-inline: var(--oryx-space-4);
  }

  :host([delimiter]) {
    border-block-start: solid 1px var(--oryx-color-neutral-6);
  }

  :host([accented]) span:first-child {
    ${headingUtil(HeadingTag.H5)};
  }

  :host([accented]) span:nth-child(2) {
    ${headingUtil(HeadingTag.H3)};
  }

  :host([subtext]) > span:not(.subtext) {
    padding-block-end: 0;
  }

  span {
    ${headingUtil(HeadingTag.H6)};

    padding-block: var(--oryx-space-2);
  }

  .subtext {
    padding-block-start: 0;
    grid-column: 1/-1;
    text-align: end;
    color: var(--oryx-color-neutral-9);
  }

  oryx-collapsible {
    box-sizing: border-box;
    width: 100%;
  }

  span:has(+ ul),
  ul span {
    padding-block: 0;
  }

  span > ul {
    padding-block: var(--oryx-space-2);
  }

  ul {
    grid-column: 1 / span 2;
    list-style: none;
    padding: 0;
    margin: var(--oryx-space) 0;
    color: var(--oryx-color-neutral-9);
  }

  li {
    display: grid;
    grid-template-columns: 1fr max-content;
  }

  li:not(:last-child) {
    margin-block-end: 10px;
  }

  span[slot='aside'],
  ul span:nth-child(2) {
    margin-inline-start: auto;
    color: var(--oryx-color-highlight-10);
  }

  ul span {
    font-size: initial;
    font-weight: initial;
    line-height: initial;
  }
`;

const smallScreen = css`
  :host {
    display: flex;
    justify-content: space-between;
    padding-inline: var(--oryx-space-4);
  }

  :host([accented]) span:nth-child(2) {
    ${headingUtil(HeadingTag.H1)};
  }

  span {
    ${headingUtil(HeadingTag.H3)};
  }

  .subtext {
    ${headingUtil(HeadingTag.H4)};
  }
`;

export const siteSummaryPriceRules: ThemeStylesheets = screenCss({
  sm: smallScreen,
});
