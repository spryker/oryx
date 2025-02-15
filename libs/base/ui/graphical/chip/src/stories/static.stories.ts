import { AlertType } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Chip/Static` } as Meta;

const longText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim';

const gen = (type?: AlertType) => {
  return html`
    <section>
      <span>${type ?? 'base'}</span>
      ${[...Array(10).keys()].map(
        (num) => html`
          <oryx-chip .appearance=${type} dense> ${num + 1} </oryx-chip>
        `
      )}
      <oryx-chip .appearance=${type}>Standard</oryx-chip>
      <oryx-chip .appearance=${type} invert>Invert</oryx-chip>
      <oryx-chip .appearance=${type}>${longText}</oryx-chip>
    </section>
  `;
};

const Template: Story = (): TemplateResult => {
  return html`
    ${gen(AlertType.Success)} ${gen(AlertType.Info)} ${gen(AlertType.Warning)}
    ${gen(AlertType.Error)} ${gen()}

    <style>
      section {
        display: grid;
        grid-auto-columns: min-content;
        grid-auto-flow: column;
        gap: 5px;
        padding: 10px;
      }

      span {
        width: 100px;
      }

      oryx-chip {
        max-width: 200px;
      }
    </style>
  `;
};

export const States = Template.bind({});
