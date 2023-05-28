import { css } from 'lit';

export const SingleFacetControlStyles = css`
  :host {
    padding-inline: 20px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-block: 0;
    padding-inline-start: 0;
    list-style-type: none;
  }

  ul ul {
    padding-block-start: 10px;
    padding-inline-start: 25px;
  }

  .label {
    display: flex;
    gap: 10px;
  }

  .label > *:first-child {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .counter {
    margin-inline-start: auto;
  }
`;
