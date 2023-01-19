import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Swatch` };

const renderRow = (colors: string[], title?: string): TemplateResult => {
  return html`
    <h4>${title ?? colors.join(' / ')}</h4>
    <div class="row">
      ${colors.map(
        (color) => html`<oryx-swatch .color=${color}></oryx-swatch>`
      )}
    </div>
  `;
};

const Template = (): TemplateResult => {
  return html`
    <style>
      h4 {
        margin-block-end: 10px;
      }

      .row {
        display: grid;
        grid-template-columns: repeat(3, 30px);
        margin-block-end: 20px;
      }
    </style>

    ${renderRow(['red', 'green', 'blue'])} ${renderRow(['#11856e', '#94DDC0'])}
    ${renderRow(['rgb(17, 133, 110)', 'rgba(17, 133, 110, 0.5)'])}
    ${renderRow(['hsl(168deg 77% 29%)', 'hsl(156deg 52% 72%)'])}
    ${renderRow(['hwb(168deg 7% 49%)', 'hwb(156deg 57% 13%)'])}
    ${renderRow(
      [
        "url('https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80')",
      ],
      "url('Image URL')"
    )}
  `;
};

export const Static = Template.bind({});
