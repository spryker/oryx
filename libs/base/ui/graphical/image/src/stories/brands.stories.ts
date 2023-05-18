import { getThemeGraphics } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Graphical/Image`,
} as Meta;

const resources = getThemeGraphics();

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Colored</h3>
    <oryx-layout
      .layout=${'grid'}
      style="--oryx-column-count:6;gap:50px 100px;padding:50px"
    >
      ${resources.map(
        (resource) => html`<oryx-image .resource=${resource}></oryx-image>`
      )}
    </oryx-layout>

    <h3>Ink color</h3>
    <oryx-layout
      .layout=${'grid'}
      style="--oryx-column-count:6;gap:100px;padding:50px;--oryx-fill:var(--oryx-color-ink)"
    >
      ${resources.map(
        (resource) => html`<oryx-image .resource=${resource}></oryx-image>`
      )}
    </oryx-layout>
  `;
};
export const Brands = Template.bind({});
