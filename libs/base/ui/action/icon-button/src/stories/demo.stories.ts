import { getAppIcons } from '@/tools/storybook';
import { Size } from '@spryker-oryx/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { storybookPrefix } from '../../../../.constants';
import { IconButtonProperties } from '../icon-button.model';

const icons = getAppIcons();

export default {
  title: `${storybookPrefix}/Actions/Icon Button`,
  args: {
    disabled: false,
    icon: icons[0],
    size: Size.Md,
    text: '',
  },
  argTypes: {
    size: {
      options: [Size.Lg, Size.Md, Size.Sm],
      control: { type: 'select' },
    },
    icon: {
      options: Object.values(icons),
      control: { type: 'select' },
      table: { category: 'demo' },
    },
    disabled: {
      control: { type: 'boolean' },
      table: { category: 'demo' },
    },
    text: {
      control: { type: 'text' },
      table: { category: 'demo' },
    },
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props {
  disabled?: boolean;
  icon?: string;
  text?: string;
}

const Template: Story<IconButtonProperties & Props> = ({
  size,
  disabled,
  icon,
  text,
}: IconButtonProperties & Props): TemplateResult => {
  return html`
    <oryx-icon-button size=${ifDefined(size)}>
      <button ?disabled=${disabled} aria-label="story">
        <oryx-icon .type=${ifDefined(icon)}></oryx-icon>
      </button>
      ${text}
    </oryx-icon-button>
  `;
};

export const Demo = Template.bind({});
