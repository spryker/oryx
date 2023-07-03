import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import {
  CollapsibleAppearance,
  CollapsibleAttributes,
  CollapsibleToggleControlType,
} from '../collapsible.model';

export default {
  title: `${storybookPrefix}/Structure/Collapsible`,
  args: {
    appearance: CollapsibleAppearance.Block,
    toggleControlType: CollapsibleToggleControlType.IconButton,
    heading: 'heading',
    nonTabbable: false,
  },
  argTypes: {
    appearance: {
      options: [CollapsibleAppearance.Block, CollapsibleAppearance.Inline],
      control: { type: 'select' },
    },
    toggleControlType: {
      options: [
        CollapsibleToggleControlType.IconButton,
        CollapsibleToggleControlType.TextButton,
      ],
      control: { type: 'select' },
    },
    open: {
      control: { type: 'boolean' },
    },
    nonTabbable: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story<CollapsibleAttributes> = (props): TemplateResult => {
  return html`
    <oryx-collapsible
      ?open=${props.open}
      .appearance=${props.appearance}
      .toggleControlType=${props.toggleControlType}
      .heading=${props.heading}
      ?nonTabbable=${props.nonTabbable}
    >
      Content with <button>accessible</button> elements.
    </oryx-collapsible>
  `;
};

export const CollapsibleDemo = Template.bind({});
