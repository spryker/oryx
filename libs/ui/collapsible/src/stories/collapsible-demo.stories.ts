import { useComponent } from '@spryker-oryx/core/utilities';
import { uiBackofficeTheme } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { collapsibleComponent } from '../collapsible.def';
import {
  CollapsibleAppearance,
  CollapsibleProps,
  CollapsibleToggleControlType,
} from '../collapsible.model';

useComponent(
  collapsibleComponent({ theme: uiBackofficeTheme['oryx-collapsible'] })
);

export default {
  title: `${storybookPrefix}/Structure/Collapsible`,
  args: {
    appearance: CollapsibleAppearance.Block,
    toggleAppearance: CollapsibleToggleControlType.IconButton,
    header: 'header',
  },
  argTypes: {
    appearance: {
      options: [CollapsibleAppearance.Block, CollapsibleAppearance.Inline],
      control: { type: 'select' },
    },
    toggleAppearance: {
      options: [
        CollapsibleToggleControlType.IconButton,
        CollapsibleToggleControlType.TextButton,
      ],
      control: { type: 'select' },
    },
    open: {
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
      .toggleAppearance=${props.toggleControlType}
      .header=${props.header}
    >
      Content with <button>accessible</button> elements.
    </oryx-collapsible>
  `;
};

export const CollapsibleDemo = Template.bind({});
