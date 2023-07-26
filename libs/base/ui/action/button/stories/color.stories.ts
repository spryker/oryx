import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ButtonColor } from '../button.model';
import { renderButtons } from './util';

export default {
  title: `${storybookPrefix}/Actions/Button/Static`,
} as Meta;

const colors = [ButtonColor.Primary, ButtonColor.Neutral, ButtonColor.Error];

const PrimaryTemplate: Story = (): TemplateResult => {
  return html`<section>
      ${colors.map((color) => renderButtons(color, { color }))}
    </section>

    <style>
      section {
        display: grid;
        grid-template-columns: repeat(10, max-content);
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
