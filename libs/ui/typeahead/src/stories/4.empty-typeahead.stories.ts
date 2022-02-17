import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

interface Props {
  emptyMessage: string;
}

const Template: Story<Props> = ({ emptyMessage }: Props): TemplateResult => {
  return html`
    <oryx-typeahead .options=${{ isEmpty: true, emptyMessage }}>
      <input value="value is required to show empty message" />
    </oryx-typeahead>
  `;
};

export const Empty = Template.bind({});
Empty.argTypes = {
  emptyMessage: {
    control: { type: 'text' },
  },
};
