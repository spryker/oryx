import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { ButtonComponentAttributes, ButtonType } from '../button.model';

export default {
  title: `${storybookPrefix}/Actions/Button`,
  args: {
    type: ButtonType.Primary,
    size: Size.Lg,
    loading: false,
    confirmed: false,
    outline: false,
  },
  argTypes: {
    type: {
      options: Object.values(ButtonType),
      control: { type: 'select' },
    },
    size: {
      options: [Size.Lg, Size.Md, Size.Sm],
      control: { type: 'select' },
    },
    loading: {
      description: 'Button loader',
    },
  },
  chromatic: { disableSnapshot: true },
} as Meta;

const Template: Story<ButtonComponentAttributes> = (
  props: ButtonComponentAttributes
): TemplateResult => {
  return html`
    <div class="button-component">
      <oryx-button
        type=${ifDefined(props.type)}
        size=${ifDefined(props.size)}
        ?loading=${props.loading}
        ?confirmed=${props.confirmed}
        ?outline=${props.outline}
      >
        <button>Button</button>
      </oryx-button>

      <oryx-button
        type=${ifDefined(props.type)}
        size=${ifDefined(props.size)}
        ?loading=${props.loading}
        ?confirmed=${props.confirmed}
        ?outline=${props.outline}
      >
        <a href="/">Link</a>
      </oryx-button>

      <oryx-button
        type=${ifDefined(props.type)}
        size=${ifDefined(props.size)}
        ?loading=${props.loading}
        ?confirmed=${props.confirmed}
        ?outline=${props.outline}
      >
        <button>
          <oryx-icon type="rocket"></oryx-icon>
          Button with icon
        </button>
      </oryx-button>

      <oryx-button
        type=${ifDefined(props.type)}
        size=${ifDefined(props.size)}
        ?loading=${props.loading}
        ?confirmed=${props.confirmed}
        ?outline=${props.outline}
      >
        <button disabled>Disabled button</button>
      </oryx-button>
    </div>
    <style>
      .button-component {
        width: auto;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    </style>
  `;
};

export const Demo = Template.bind({});
