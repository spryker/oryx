import { AlertType } from '@spryker-oryx/ui';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Swatch` };

const Template = (): TemplateResult => {
  return html`
    <h4>Alert types</h4>
    <oryx-swatch .type=${AlertType.Info}></oryx-swatch>
    <oryx-swatch .type=${AlertType.Success}></oryx-swatch>
    <oryx-swatch .type=${AlertType.Warning}></oryx-swatch>
    <oryx-swatch .type=${AlertType.Error}></oryx-swatch>

    <h4>Named colors</h4>
    <oryx-swatch .color=${'red'}></oryx-swatch>
    <oryx-swatch .color=${'green'}></oryx-swatch>
    <oryx-swatch .color=${'blue'}></oryx-swatch>

    <h4>Color variables</h4>
    <oryx-swatch .color=${'var(--oryx-color-primary-3)'}></oryx-swatch>
    <oryx-swatch .color=${'var(--oryx-color-primary-7)'}></oryx-swatch>
    <oryx-swatch .color=${'var(--oryx-color-primary-9)'}></oryx-swatch>
    <oryx-swatch .color=${'var(--oryx-color-primary-10)'}></oryx-swatch>
    <oryx-swatch .color=${'var(--oryx-color-primary-12)'}></oryx-swatch>

    <h4>Hex colors</h4>
    <oryx-swatch .color=${'#11856e'}></oryx-swatch>
    <oryx-swatch .color=${'#94DDC0'}></oryx-swatch>

    <h4>Rgb colors</h4>
    <oryx-swatch .color=${'rgb(17, 133, 110)'}></oryx-swatch>
    <oryx-swatch .color=${'rgba(17, 133, 110, 0.5)'}></oryx-swatch>

    <h4>Hsl colors</h4>
    <oryx-swatch .color=${'hsl(168deg 77% 29%)'}></oryx-swatch>
    <oryx-swatch .color=${'hsl(156deg 52% 72%)'}></oryx-swatch>

    <h4>Images</h4>
    <oryx-swatch
      .color=${`url('https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXN8ZW58MHx8MHx8&w=1000&q=80')`}
    ></oryx-swatch>
  `;
};

export const Static = Template.bind({});
