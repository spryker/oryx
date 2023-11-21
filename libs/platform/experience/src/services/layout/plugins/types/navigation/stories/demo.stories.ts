import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Layout/Navigation`,
  args: {
    vertical: false,
    gap: '20px',
  },
  argTypes: {
    vertical: {
      control: { type: 'boolean' },
      table: { category: 'demo' },
    },
    gap: {
      control: { type: 'text' },
      table: { category: 'demo' },
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

interface DemoProps {
  vertical: boolean;
  gap: string;
}

const Template: Story<DemoProps> = (props: DemoProps): TemplateResult => {
  const options = {
    rules: [
      {
        layout: { type: 'navigation', vertical: props.vertical },
        gap: props.gap,
      },
    ],
  };
  return html`
    <oryx-layout .options=${options}>
      <oryx-content-link
        .options=${{ url: '/', icon: 'home' }}
        .content=${{ text: 'Home' }}
      ></oryx-content-link>
      ${[2, 5, 9, 11].map(
        (id) =>
          html`<oryx-content-link
            .options=${{ id: id.toString(), type: 'category' }}
          ></oryx-content-link>`
      )}
    </oryx-layout>
  `;
};

export const Demo = Template.bind({});
