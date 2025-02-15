import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Password/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`<oryx-password-input label="Customised password" suffixFill>
    <div slot="prefix" style="white-space: nowrap;">
      Password control prefix:
    </div>
    <input type="password" value="Change123$" placeholder="Placeholder..." />
    <div slot="error">
      Your password needs to:
      <div style="color:green">
        ✅ Include both lower and upper case characters
      </div>
      <div>
        <style>
          oryx-icon {
            display: inline-flex;
            --oryx-icon-size-default: 12px;
          }
        </style>
        <oryx-icon .type=${IconTypes.Error}></oryx-icon>
        Include at least one number or symbol
      </div>
      <div>
        <oryx-icon .type=${IconTypes.Error}></oryx-icon>
        Be at least 8 characters long
      </div>
    </div>
  </oryx-password-input>`;
};

export const CustomUI = Template.bind({});
