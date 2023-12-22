import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default { title: `${storybookPrefix}/Data/Link` };

const Template: Story = (): TemplateResult => {
  resolve(ContextService).provide(document.body, 'merchant', {
    id: '1',
  });
  return html`
    <div>
      <h3>Without label and icon</h3>
      <oryx-data-link
        .options=${{ entity: 'merchant', field: 'url' }}
      ></oryx-data-link>
      <oryx-data-link
        .options=${{
          entity: 'merchant',
          field: 'contact.phone',
        }}
      ></oryx-data-link>
      <oryx-data-link
        .options=${{
          entity: 'merchant',
          field: 'contact.email',
        }}
      ></oryx-data-link>
    </div>

    <div>
      <h3>With label and icon</h3>
      <oryx-data-link
        .options=${{
          entity: 'merchant',
          field: 'url',
          icon: IconTypes.Link,
          label: 'Visit our website',
        }}
      ></oryx-data-link>

      <oryx-data-link
        .options=${{
          entity: 'merchant',
          field: 'contact.phone',
          icon: IconTypes.Phone,
          label: 'Call us',
        }}
      ></oryx-data-link>

      <oryx-data-link
        .options=${{
          entity: 'merchant',
          field: 'contact.email',
          icon: IconTypes.Email,
          label: 'Send us an email',
        }}
      ></oryx-data-link>
    </div>
  `;
};

export const Static = Template.bind({});
