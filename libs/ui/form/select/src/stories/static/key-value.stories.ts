import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { sideBySide } from '../../../../../utilities/storybook';
import { keyValueSelectOptions } from './common';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const logValue = (e): void => {
    const el = e.target.parentElement.querySelector('[slot="label"] > span');
    el.textContent = e.target.value;
  };

  return html`
    ${sideBySide(html`
      <oryx-select ?allowEmptyValue=${true} has-label>
        <span slot="label">Selected Value: <span></span></span>
        <select @change=${logValue}>
          ${keyValueSelectOptions.map(
            (option) =>
              html`<option value=${option.key}>${option.value}</option>`
          )}
        </select>
      </oryx-select>
    `)}
  `;
};

export const KeyValue = Template.bind({});

KeyValue.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
};
