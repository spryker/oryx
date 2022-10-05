import { useComponent } from '@spryker-oryx/core/utilities';
import { uiBackofficeTheme } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { chipComponent } from '../chip.def';
import { ChipAppearance, ChipAttributes } from '../chip.model';

useComponent(chipComponent({ theme: uiBackofficeTheme['oryx-chip'] }));

export default {
  title: `${storybookPrefix}/Graphical/Chip`,
  args: {
    dense: false,
  },
} as Meta;

const Template: Story<ChipAttributes> = (
  props: ChipAttributes
): TemplateResult => {
  return html`
    <oryx-chip .appearance=${props.appearance} ?dense=${props.dense}
      >Text <b>content</b>
    </oryx-chip>
  `;
};

export const ChipDemo = Template.bind({});

ChipDemo.parameters = {
  chromatic: { disableSnapshot: true },
};

ChipDemo.argTypes = {
  appearance: {
    options: Object.values(ChipAppearance),
    control: { type: 'select' },
  },
};
