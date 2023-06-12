import {
  extendVariants,
  generateVariantsMatrix,
  storybookDefaultViewports,
  variantsGroupTemplate,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { basePasswordInputVariants, groups } from './common';

export default {
  title: `${storybookPrefix}/Form/Password/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${groups.map((group, index) =>
      variantsGroupTemplate(
        () => html`
          ${generateVariantsMatrix(
            [
              ...extendVariants(basePasswordInputVariants, {
                options: {
                  value: 'Change123$',
                  ...group.options,
                },
              }),
            ],
            ({
              options: {
                floatLabel,
                disabled,
                value,
                visible,
                errorMessage,
                hasError,
              },
            }) => html`
              <oryx-password-input
                label="Label"
                ?floatLabel=${floatLabel}
                ?visible=${visible}
                errorMessage=${errorMessage}
                ?hasError=${hasError}
              >
                <input
                  type=${visible ? 'text' : 'password'}
                  value=${value}
                  placeholder="Placeholder..."
                  ?disabled=${disabled}
                />
              </oryx-password-input>
            `,
            { smallDisplayBreakpoint: storybookDefaultViewports.mobile.max }
          )}
        `,
        { title: group.title, addSeparator: index < groups.length - 1 }
      )
    )}
  `;
};

export const Variants = Template.bind({});
