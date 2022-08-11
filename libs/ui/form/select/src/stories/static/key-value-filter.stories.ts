import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { FilterStrategyType } from '../../../../../search/typeahead';
import { sideBySide } from '../../../../../utilities/storybook';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const selectOptions = [
    { key: 1, value: 'Red' },
    { key: 2, value: 'Green' },
    { key: 3, value: 'Blue' },
  ];

  const logValue = (e): void => {
    const el = e.target.parentElement.querySelector('[slot="label"] > span');
    el.textContent = e.target.value;
  };

  return html`
    ${sideBySide(html`
      <oryx-select
        ?allowEmptyValue=${true}
        has-label
        filterStrategy=${FilterStrategyType.START_OF_WORD}
        contenteditable="false"
      >
        <span slot="label">Selected Value: <span></span></span>
        <select @change=${logValue}>
          <option value hidden>select something from the list</option>
          ${selectOptions.map(
            (option) =>
              html`<option value=${option.key}>${option.value}</option>`
          )}
        </select>
      </oryx-select>
    `)}
  `;
};

export const KeyValueFilter = Template.bind({});
