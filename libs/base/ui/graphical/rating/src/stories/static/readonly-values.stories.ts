import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default { title: `${storybookPrefix}/Graphical/Rating/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div class="ratings">
      ${[0, 1, 2, 3, 4].map((i) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(
          (j) => html`<oryx-rating readonly value=${i + j / 10}></oryx-rating>`
        )
      )}
    </div>
    <style>
      .ratings {
        display: grid;
        grid-template-rows: repeat(10, 1fr);
        grid-template-columns: repeat(5, 1fr);
        grid-auto-flow: column;
      }
    </style>
  `;
};

export const ReadonlyValuesLarge = Template.bind({});
