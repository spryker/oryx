import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../constant';
import '../index';

export default {
  title: `${storybookPrefix}/Search/SearchBox`,
} as Meta;

type Props = {
  value: string;
  disabled: boolean;
  readonly: boolean;
  clearIcon: string;
};

const Template: Story<Props> = ({
  value,
  disabled,
  readonly,
  clearIcon,
}: Props): TemplateResult => {
  return html`
    <div style="width:500px">
      <oryx-search
        .options=${{ label: 'search', suffixIcon: 'desktop', clearIcon }}
        class="prefix-fill"
      >
        <select slot="prefix">
          <option>products</option>
          <option>content</option>
          <option>category</option>
        </select>
        <input
          placeholder="Search..."
          .value=${value}
          ?disabled=${disabled}
          ?readonly=${readonly}
        />
      </oryx-search>
    </div>
  `;
};
export const CustomUI = Template.bind({});
CustomUI.args = {
  value: '',
  disabled: false,
  readonly: false,
  clearIcon: 'close',
};
