import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Tag/Static`,
} as Meta;

const variations = [
  {
    name: 'default',
    state: '',
  },
  {
    name: 'hovered',
    state: 'pseudo-hover',
  },
  {
    name: 'focused',
    state: 'pseudo-focus pseudo-focus-visible',
  },
  {
    name: 'disabled',
    state: '',
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    ${variations.map((variant) => {
      const isDisabled = variant.name === 'disabled';

      return html`
        <div class="row">
          <div class="col variant">
            <span>${variant.name}</span>
          </div>
          <div class="col ${variant.state}">
            <oryx-tag ?disabled=${isDisabled}>This is tag</oryx-tag>
          </div>
        </div>
      `;
    })}
    <style>
      .row {
        display: flex;
        align-items: center;
        gap: 40px;
        margin-bottom: 24px;
      }

      .col {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .col.variant {
        width: 100px;
        color: #71747c;
      }
    </style>
  `;
};

export const States = Template.bind({});
