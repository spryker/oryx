import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../index';
import { m, xl, xs } from '../images';

export default { title: `${storybookPrefix}/graphical/Image/Static` } as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  const renderImage = (factor: number): TemplateResult => {
    const vw = window.innerWidth;
    return html`
      <oryx-image>
        <source media="(min-width: ${vw + factor}px)" srcset=${xl} />
        <source media="(min-width: ${vw + factor - 1}px)" srcset=${m} />
        <img src=${xs} alt="preview" />
      </oryx-image>
    `;
  };
  return html`
    <style>
      oryx-image {
        --image-max-width: 160px;
        --image-max-height: 160px;
      }

      tr {
        vertical-align: top;
      }

      tr > * {
        padding: 10px;
      }

      tr:nth-child(2) td:last-child oryx-image {
        --image-max-width: 128px;
        --image-max-height: 128px;
      }

      tr:nth-child(3) td:last-child oryx-image {
        --image-max-width: 64px;
        --image-max-height: 64px;
      }
    </style>

    <table>
      <thead>
        <tr>
          <th>Scaled</th>
          <th>Original size</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from(new Array(3).keys()).map((value) => {
          return html`
            <tr>
              <td>${renderImage(value)}</td>
              <td>${renderImage(value)}</td>
            </tr>
          `;
        })}
      </tbody>
    </table>
  `;
};

export const Layouts = Template.bind({});
