import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Layout/Navigation`,
} as Meta;

interface DemoProps {
  vertical: boolean;
  gap: string;
}

const Template: Story = (): TemplateResult => {
  const items = html` <oryx-content-link
      .options=${{ url: '/', icon: IconTypes.Home }}
      .content=${{ text: 'Home' }}
    ></oryx-content-link>

    ${[2, 5, 9, 11].map(
      (id) =>
        html`<oryx-content-link
          .options=${{ id: id.toString(), type: 'category' }}
        ></oryx-content-link>`
    )}`;

  return html`
    <h3>Horizonal</h3>
    <oryx-layout
      .options=${{
        rules: [
          { layout: { type: 'navigation', vertical: false }, gap: '40px' },
        ],
      }}
    >
      ${items}
    </oryx-layout>
    <h3>Vertical</h3>
    <oryx-layout
      .options=${{
        rules: [
          { layout: { type: 'navigation', vertical: true }, gap: '10px' },
        ],
      }}
    >
      <oryx-content-link
        .options=${{ url: '/', icon: 'home' }}
        .content=${{ text: 'Home' }}
      ></oryx-content-link>
      <oryx-content-link
        .options=${{ url: '/Profile', icon: 'person' }}
        .content=${{ text: 'Profile' }}
      ></oryx-content-link>
    </oryx-layout>

    <h3>Horizonal</h3>
    <oryx-layout
      style="width: 500px;"
      .options=${{
        rules: [
          { layout: { type: 'navigation', vertical: false }, gap: '40px' },
        ],
      }}
    >
      ${items}
    </oryx-layout>
  `;
};

export const Static = Template.bind({});
