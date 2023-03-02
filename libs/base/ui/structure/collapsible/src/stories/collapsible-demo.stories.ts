import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import {
  CollapsibleAppearance,
  CollapsibleProps,
  CollapsibleToggleControlType,
} from '../collapsible.model';

export default {
  title: `${storybookPrefix}/Structure/Collapsible`,
  args: {
    appearance: CollapsibleAppearance.Block,
    toggleControlType: CollapsibleToggleControlType.IconButton,
    header: 'header',
    nonTabbable: false
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
        CollapsibleToggleControlType.None,
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
} as Meta;

const Template: Story<CollapsibleProps> = (
  props: CollapsibleProps
): TemplateResult => {
  return html`
    <oryx-collapsible
      ?open=${props.open}
      .appearance=${props.appearance}
      .toggleControlType=${props.toggleControlType}
      .header=${props.header}
      ?nonTabbable=${props.nonTabbable}
    >
      Content with <button>accessible</button> elements.
    </oryx-collapsible>
  `;
};

export const CollapsibleDemo = Template.bind({});
