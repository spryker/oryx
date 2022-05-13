import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Checkbox List/Static`,
} as Meta;

type GroupItem = {
  label: string;
  checked: boolean;
};

interface Props {
  data: GroupItem[];
  title?: string;
}

const data = [
  {
    label: 'Apple',
    checked: false,
  },
  {
    label: 'Orange',
    checked: false,
  },
  {
    label: 'Pear',
    checked: false,
  },
];

const Template: Story<Props> = (): TemplateResult => {
  return html`
    <oryx-checkbox-list id="fruits" heading="TITLE">
      ${data.map((item) => {
        return html`
        <oryx-checkbox>
          <input type="checkbox" name="${item.label}" ?checked=${item.checked}></input>
          ${item.label}
        </oryx-checkbox>
      `;
      })}
    </oryx-checkbox-list>
  `;
};

export const HeadingProperty = Template.bind({});
