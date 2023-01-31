import { html, TemplateResult } from 'lit';

export const generateHeader = (): TemplateResult => {
  return html`
    <oryx-layout layout="flex">
      <div>link</div>
      <div>link</div>
      <div style="margin-inline-start:auto;">lang</div>
      <div>currency</div>
    </oryx-layout>

    <oryx-layout layout="flex" sticky style="z-index:2;--align-items: center">
      <div style="height:70px;width: 120px">logo</div>
      <div maxWidth>search</div>
      <div style="height:70px">profile</div>
      <div style="height:70px">cart</div>
    </oryx-layout>
  `;
};

export const pageStyles = html`
  <style>
    .page {
      padding-inline: 10px;
      align-items: start;
    }
    oryx-layout.page > oryx-layout {
      --padding-inline: 10px;
      padding-block: 10px;
    }

    oryx-layout.page > oryx-layout oryx-layout {
      --padding-inline: 0;
    }

    oryx-layout {
      --gap: 10px;
      background: var(--oryx-color-canvas-500);
    }

    oryx-layout div {
      background: var(--oryx-color-primary-100);
      padding: 10px;
    }

    [layout='carousel'] div,
    [layout='grid'] div {
      height: var(--h, 200px);
    }
  </style>
`;
