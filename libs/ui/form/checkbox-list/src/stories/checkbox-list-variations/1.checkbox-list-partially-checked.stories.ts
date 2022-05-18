import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Direction } from '../../../../../utilities/model';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Checkbox List/Static`,
} as Meta;

type GroupItem = {
  label: string;
  checked: boolean;
};

interface Props {
  selectAllChecked: boolean;
  selectAllIntermediate: boolean;
  data: GroupItem[];
  direction: Direction;
}

const data = [
  {
    label: 'Apple',
    checked: true,
  },
  {
    label: 'Orange',
    checked: true,
  },
  {
    label: 'Pear',
    checked: false,
  },
];

const Template: Story<Props> = (): TemplateResult => {
  return html`
    <oryx-checkbox-list id="fruits">
      <div slot="heading">
        <oryx-checkbox
          id="selectAll"
          intermediate
        >
          <input type="checkbox"></input>
          Select All
        </oryx-checkbox>
      </div>
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

export const PartiallyChecked = Template.bind({});
