import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';

export default { title: `${storybookPrefix}/Form/Radio/Static` } as Meta;

const Template: Story = (): TemplateResult =>
  html`
    <div class="container">
      <div class="row">
        <div>Default</div>
        <div>
          <oryx-radio>
            <input type="radio" />
            Option
          </oryx-radio>
        </div>
        <div>
          <oryx-radio>
            <input type="radio" checked />
            Option
          </oryx-radio>
        </div>
      </div>

      <div class="row">
        <div>Hovered</div>
        <div>
          <oryx-radio>
            <input class="pseudo-hover" type="radio" />
            Option
          </oryx-radio>
        </div>
        <div>
          <oryx-radio>
            <input class="pseudo-hover" type="radio" checked />
            Option
          </oryx-radio>
        </div>
      </div>

      <div class="row">
        <div>Focused</div>
        <div>
          <oryx-radio>
            <input class="pseudo-focus-visible" type="radio" />
            Option
          </oryx-radio>
        </div>
        <div>
          <oryx-radio>
            <input class="pseudo-focus-visible" type="radio" checked />
            Option
          </oryx-radio>
        </div>
      </div>

      <div class="row">
        <div>Disabled</div>
        <div>
          <oryx-radio>
            <input type="radio" disabled />
            Option
          </oryx-radio>
        </div>
        <div>
          <oryx-radio>
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
export const States = Template.bind({});
