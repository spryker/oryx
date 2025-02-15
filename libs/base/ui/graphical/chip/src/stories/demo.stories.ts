import { AlertType } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { ChipAttributes } from '../chip.model';

export default {
  title: `${storybookPrefix}/Graphical/Chip`,
  args: {
    dense: false,
    invert: false,
  },
  argTypes: {
    appearance: {
      options: [
        AlertType.Info,
        AlertType.Success,
        AlertType.Warning,
        AlertType.Error,
      ],
      control: { type: 'select' },
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta;

const Template: Story<ChipAttributes> = (
  props: ChipAttributes
): TemplateResult => {
  return html`
    <oryx-chip
      .appearance=${props.appearance}
      ?dense=${props.dense}
      ?invert=${props.invert}
      >Text <b>content</b>
    </oryx-chip>
  `;
};

export const ChipDemo = Template.bind({});
