import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../.storybook/constant';
import { Direction } from '../../../../utilities/model';
import { CheckboxComponent } from '../../../checkbox/src';
import { CheckboxListComponent } from '../checkbox-list.component';
import { CheckboxListStatus } from '../checkbox-list.model';
import '../index';

export default {
  title: `${storybookPrefix}/Form/Checkbox List`,
} as Meta;

interface Props {
  title: string;
  direction: Direction;
}

const groupData = [
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

const Template: Story<Props> = ({ direction, title }): TemplateResult => {
  const updateCheckboxState = (): void => {
    const group =
      document.querySelector<CheckboxListComponent>('oryx-checkbox-list');
    const groupStatus = group?.getGroupStatus();
    const selectAll = document.querySelector<CheckboxComponent>('#selectAll');
    const selectAllInput =
      document.querySelector<HTMLInputElement>('#selectAll input');

    if (selectAllInput) {
      selectAllInput.checked = groupStatus !== CheckboxListStatus.unchecked;
    }

    if (selectAll) {
      selectAll.intermediate =
        groupStatus === CheckboxListStatus.partiallyChecked;
    }
  };

  const handleToggle = (): void => {
    document.querySelector<CheckboxListComponent>('#fruits')?.toggle();
    updateCheckboxState();
  };

  const handleGroupInput = (): void => {
    updateCheckboxState();
  };

  return html`
    <oryx-checkbox-list
      direction=${direction}
      id="fruits"
      @input=${(): void => handleGroupInput()}
      heading=${title}
    >
      <div slot="heading">
        <p class="title">${title}</p>
        <oryx-checkbox @click=${handleToggle} id="selectAll">
          <input type="checkbox"></input>
          Select All
        </oryx-checkbox>
      </div>
      ${groupData.map((item) => {
        return html`
          <oryx-checkbox>
            <input type="checkbox" name="${item.label}" ?checked=${item.checked}></input>
            ${item.label}
          </oryx-checkbox>
        `;
      })}
    </oryx-checkbox-list>
    <style>
      .title {
        margin: 0 0 8px 0;
      }
    </style>
  `;
};

export const CheckboxListDemo = Template.bind({});

CheckboxListDemo.args = {
  title: 'TITLE',
  direction: Direction.horizontal,
};

CheckboxListDemo.argTypes = {
  direction: {
    options: Object.values(Direction),
    control: { type: 'select' },
  },
};
