import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
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
      <oryx-select ?allowEmptyValue=${true} has-label>
        <span slot="label">Selected Value: <span></span></span>
        <select @change=${logValue}>
          ${selectOptions.map(
            (option) =>
              html`<option value=${option.key}>${option.value}</option>`
          )}
        </select>
      </oryx-select>
    `)}
  `;
};

export const KeyValue = Template.bind({});
