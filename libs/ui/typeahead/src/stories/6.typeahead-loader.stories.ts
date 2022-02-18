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
    <div class="stories">
      <oryx-typeahead .options=${{ isLoading }}>
        <input value="value" aria-label="label" />
      </oryx-typeahead>

      <oryx-typeahead
        .options=${{ isLoading }}
        style="--oryx-popover-visible: 1;"
      >
        <input value="value" aria-label="label" />
      </oryx-typeahead>
    </div>

    <style>
      .stories {
        display: flex;
        gap: 10px;
      }
      oryx-typeahead {
        flex: 0 0 350px;
      }
    </style>
  `;
};

export const Loader = Template.bind({});
Loader.args = {
  isLoading: true,
} as Props;
