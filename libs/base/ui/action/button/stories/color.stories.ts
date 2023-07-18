import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ButtonColor, ButtonSize } from '../button.model';
import { renderButtons, staticButtons } from './util';

export default {
  title: `${storybookPrefix}/Actions/Button/Static`,
} as Meta;

const colors = [
  ButtonColor.Primary,
  ButtonColor.Secondary,
  ButtonColor.Neutral,
  ButtonColor.Warning,
  ButtonColor.Info,
  ButtonColor.Error,
  ButtonColor.Success,
];

const PrimaryTemplate: Story = (): TemplateResult => {
  return html`<section>
      ${colors.map((color) => renderButtons(color, { color }))}
    </section>

    <style>
      section {
        display: grid;
        grid-template-columns: repeat(11, max-content);
        gap: 10px;
        justify-items: start;
        align-items: center;
        padding-block: 10px;
      }

      section span {
        display: flex;
        gap: 10px;
      }
    </style>`;
};

export const Colors = PrimaryTemplate.bind({});
