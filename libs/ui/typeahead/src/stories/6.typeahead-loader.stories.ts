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
  isLoading: boolean;
}

const Template: Story<Props> = ({ isLoading }: Props): TemplateResult => {
  return sideBySide(html` <oryx-typeahead ?isLoading=${isLoading}>
    <input value="value" aria-label="label" />
  </oryx-typeahead>`);
};

export const Loader = Template.bind({});
Loader.args = {
  isLoading: true,
} as Props;
