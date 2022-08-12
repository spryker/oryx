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
              label="select"
              ?emptyOption=${true}
              ?has-label=${!group.options.floatLabel}
              ?floatLabel=${group.options.floatLabel}
            >
              <select>
                ${selectOptions.map(
                  (value) =>
                    html`<option ?selected=${value === 'Green'}>
                      ${value}
                    </option>`
                )}
              </select>
            </oryx-select>
          `),
        { title: group.title, addSeparator: index < groups.length - 1 }
      )
    )}
    ${styles}
  `;
};

export const Selected = Template.bind({});
