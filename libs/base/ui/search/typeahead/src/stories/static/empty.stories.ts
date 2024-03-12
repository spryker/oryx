import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Empty`,
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
