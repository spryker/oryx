import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default { title: `${storybookPrefix}/Data/Image` };

const Template: Story = (): TemplateResult => {
  resolve(ContextService).provide(document.body, 'merchant', {
    id: '1',
  });
  return html`
    <div>
      <h3>Context image</h3>

      <oryx-data-image
        .options=${{
          entity: 'merchant',
          field: 'banner',
        }}
      ></oryx-data-image>

      <h3>Unknown without fallback image</h3>
      <oryx-data-image
        .options=${{
          entity: 'merchant',
          field: 'unknown',
        }}
      ></oryx-data-image>

      <h3>Unknown with fallback image</h3>
      <oryx-data-image
        .options=${{
          entity: 'merchant',
          field: 'unknown',
          renderFallback: true,
        }}
      ></oryx-data-image>
    </div>
    <style>
      div {
        display: flex;
        flex-direction: column;
        width: 300px;
      }
    </style>
  `;
};

export const Static = Template.bind({});
