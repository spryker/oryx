import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Form/Radio/Static` } as Meta;

const Template: Story = (): TemplateResult =>
  html`
    <div class="container">
      <div class="row">
        <div>Default</div>
        <div>
          <oryx-radio errorMessage="Error message">
            <input type="radio" />
            Option
          </oryx-radio>
        </div>
        <div>
          <oryx-radio errorMessage="Error message">
            <input type="radio" checked />
            Option
          </oryx-radio>
        </div>
      </div>

      <div class="row">
        <div>No message</div>
        <div>
          <oryx-radio hasError>
            <input type="radio" />
            Option
          </oryx-radio>
        </div>
        <div>
          <oryx-radio hasError>
            <input type="radio" checked />
            Option
          </oryx-radio>
        </div>
      </div>

      <div class="row">
        <div>Custom</div>
        <div>
          <oryx-radio>
            <input type="radio" />
            Option
            <span slot="error">Custom error message</span>
          </oryx-radio>
        </div>
        <div>
          <oryx-radio>
            <input type="radio" checked />
            Option
            <span slot="error">Custom error message</span>
          </oryx-radio>
        </div>
      </div>

      <div class="row">
        <div>Disabled</div>
        <div>
          <oryx-radio hasError>
            <input type="radio" disabled />
            Option
          </oryx-radio>
        </div>
        <div>
          <oryx-radio hasError>
            <input type="radio" disabled checked />
            Option
          </oryx-radio>
        </div>
      </div>
    </div>

    <style>
      .container {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .row {
        display: flex;
        width: 640px;
      }

      .row > div {
        width: 35%;
      }

      .row > div:first-child {
        width: 120px;
      }
    </style>
  `;
export const StatesWithError = Template.bind({});
