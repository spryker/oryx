import { storybookPrefix } from '../../../constant';
import '../../../option/src/index';
import { branches, sideBySide, states } from '../../../utilities/storybook';
import '../index';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';

export default {
  title: `${storybookPrefix}/search/typeahead/filter`,
} as Meta;

interface FilterProps {
  options: string;
}

const Template: Story<FilterProps> = ({
  options,
}: FilterProps): TemplateResult => {
  const compOptions = { filter: true, filterStrategy: 1 };
  const list = options === 'states' ? states : branches;
  return sideBySide(html`
    <oryx-select .options=${compOptions}>
      <input value="f" placeholder="filter the list by typing" />
      ${list.map((state) => html`<oryx-option .value=${state}></oryx-option>`)}
    </oryx-select>
  `);
};

export const StartOfWord = Template.bind({});
StartOfWord.argTypes = {
  options: {
    options: ['states', 'branches'],
    control: { type: 'select' },
    defaultValue: 'branches',
  },
};
