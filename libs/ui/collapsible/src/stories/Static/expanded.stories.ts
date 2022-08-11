import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Structure/Collapsible/Static`,
} as Meta;

const variations = [
  {
    name: 'Default',
  },
  {
    name: 'Hovered',
    state: 'pseudo-hover',
  },
  {
    name: 'Focused',
    state: 'pseudo-focus-visible',
  },
];

const Template: Story<unknown> = (): TemplateResult => {
  const renderElement = (): TemplateResult => {
    return html` ${variations.map((variant) => {
        return html`
          <p>${variant.name}</p>
          <div class="wrapper ${variant.state ?? ''}">
            <oryx-collapsible open>
              <span slot="header">Header</span>
              Content
            </oryx-collapsible>
          </div>
        `;
      })}

      <style>
        .wrapper {
          margin-bottom: 20px;
        }
      </style>`;
  };

  return html`${renderElement()}`;
};

export const Expanded = Template.bind({});
