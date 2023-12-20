import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default { title: `${storybookPrefix}/Entity Link` };

const Template: Story = (): TemplateResult => {
  resolve(ContextService).provide(document.body, 'merchant', {
    id: '1',
  });
  return html`
    <div>
      <h3>Without label and icon</h3>
      <oryx-entity-link
        .options=${{ entity: 'merchant', field: 'url' }}
      ></oryx-entity-link>
      <oryx-entity-link
        .options=${{
          entity: 'merchant',
          field: 'contact.phone',
        }}
      ></oryx-entity-link>
      <oryx-entity-link
        .options=${{
          entity: 'merchant',
          field: 'contact.email',
        }}
      ></oryx-entity-link>
    </div>

    <div>
      <h3>With label and icon</h3>
      <oryx-entity-link
        .options=${{
          entity: 'merchant',
          field: 'url',
          icon: IconTypes.Link,
          label: 'Visit our website',
        }}
      ></oryx-entity-link>

      <oryx-entity-link
        .options=${{
          entity: 'merchant',
          field: 'contact.phone',
          icon: IconTypes.Phone,
          label: 'Call us',
        }}
      ></oryx-entity-link>

      <oryx-entity-link
        .options=${{
          entity: 'merchant',
          field: 'contact.email',
          icon: IconTypes.Email,
          label: 'Send us an email',
        }}
      ></oryx-entity-link>
    </div>
  `;
};

export const Static = Template.bind({});
