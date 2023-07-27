import { html, TemplateResult } from 'lit';

export const generateHeader = (): TemplateResult => {
  return html`
    <oryx-layout
      layout="flex"
      layout-bleed
      .options=${{ rules: [{ background: 'var(--oryx-color-neutral-6)' }] }}
    >
      <div>link</div>
      <div>link</div>
      <div style="margin-inline-start:auto;">lang</div>
      <div>currency</div>
    </oryx-layout>

    <oryx-layout
      layout="flex"
      layout-bleed
      layout-sticky
      .options=${{
        rules: [
          {
            background: 'var(--oryx-color-neutral-6)',
            align: 'center',
            zIndex: 2,
          },
        ],
      }}
    >
      <div style="height:70px;width: 120px">logo</div>
      <div style="margin:auto;width: 400px;">search</div>
      <div style="height:70px">profile</div>
      <div style="height:70px">cart</div>
    </oryx-layout>
  `;
};

export const pageStyles = html`
  <style>
    oryx-layout div {
      background: var(--oryx-color-primary-3);
      padding: 10px;
      outline: solid 1px;
      outline-offset: -1px;
      place-items: center;
      display: grid;
    }

    oryx-layout div {
      height: var(--h);
    }

    .thumbs div:hover {
      background: var(--oryx-color-primary-9);
    }
  </style>
`;
