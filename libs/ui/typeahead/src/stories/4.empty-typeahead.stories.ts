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
    <div class="stories">
      <oryx-typeahead .options=${{ isEmpty: true, emptyMessage }}>
        <input value="value" aria-label="label" />
      </oryx-typeahead>

      <oryx-typeahead
        .options=${{ isEmpty: true, emptyMessage }}
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

export const Empty = Template.bind({});
Empty.argTypes = {
  emptyMessage: {
    control: { type: 'text' },
  },
};
