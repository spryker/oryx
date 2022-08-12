import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { sideBySide } from '../../../../../utilities/storybook';
import { variantsGroupTemplate } from '../../../../../utilities/storybook/variants/variants-group';
import '../../index';
import { groups, selectOptions, styles } from './common';

export default {
  title: `${storybookPrefix}/Form/Select/Static`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    ${groups.map((group, index) =>
      variantsGroupTemplate(
        () =>
          sideBySide(html`
            <oryx-select
              ?allowEmptyValue=${true}
              ?has-label=${!group.options.floatLabel}
              ?floatLabel=${group.options.floatLabel}
            >
              <span slot="label"
                >custom label requires has-label on the host
              </span>
              <select>
                ${selectOptions.map((state) => html`<option>${state}</option>`)}
              </select>
            </oryx-select>
          `),
        { title: group.title, addSeparator: index < groups.length - 1 }
      )
    )}
    ${styles}
  `;
};

export const CustomLabel = Template.bind({});
