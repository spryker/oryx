import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../../../popover/index';
import '../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead`,
} as Meta;

interface Props {
  isLoading: boolean;
}

const Template: Story<Props> = ({ isLoading }: Props): TemplateResult => {
  return html`
    <oryx-typeahead .options=${{ isLoading }}>
      <input value="value is required to show loader" />
    </oryx-typeahead>
  `;
};

export const Loader = Template.bind({});
Loader.args = {
  isLoading: true,
} as Props;
