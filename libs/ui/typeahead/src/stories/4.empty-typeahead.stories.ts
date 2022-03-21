import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import { sideBySide } from '../../../utilities/storybook';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

interface Props {
  emptyMessage: string;
}

const Template: Story<Props> = ({ emptyMessage }: Props): TemplateResult => {
  return sideBySide(html`<oryx-typeahead isEmpty emptyMessage=${emptyMessage}>
    <input value="value" aria-label="label" />
  </oryx-typeahead>`);
};

export const Empty = Template.bind({});
Empty.args = {
  emptyMessage: 'No results found',
};

Empty.argTypes = {
  emptyMessage: {
    control: { type: 'text' },
  },
};
