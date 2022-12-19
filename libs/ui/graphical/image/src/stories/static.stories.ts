import { AppRef, ResourcePlugin } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Graphical/Image`,
} as Meta;

const Template: Story = (): TemplateResult => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const graphics = resolve(AppRef)
    .findPlugin(ResourcePlugin)!
    .getResources()?.graphics;
  const images = [
    'https://d2s0ynfc62ej12.cloudfront.net/b2c/29889537_4485.jpg',
    'https://d2s0ynfc62ej12.cloudfront.net/b2c/30521602_2938.jpg',
    'https://images.icecat.biz/img/norm/medium/24495843-7844.jpg',
    'incorrect-src',
  ];

  return html`
    <section class="wrapper">
      <div>
        <h3>By resource</h3>

        ${Object.keys(graphics ?? []).map(
          (type) =>
            html`
              <div class="image">
                <h3 class="image-title">Resource token: ${type}</h3>
                <oryx-image resource=${type}></oryx-image>
              </div>
            `
        )}

        <div class="image">
          <h3 class="image-title">Incorrect token</h3>
          <oryx-image resource="not-available.jpg"></oryx-image>
        </div>
      </div>

      <div>
        <h3>By src</h3>

        ${images.map(
          (src) =>
            html`
              <div class="image">
                <oryx-image src=${src}></oryx-image>
              </div>
            `
        )}
      </div>
    </section>
    <style>
      .wrapper {
        display: flex;
        align-items: flex-start;
        gap: 40px;
      }

      h3 {
        width: 100%;
      }

      .wrapper > div {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        width: 50%;
        gap: 40px;
      }

      .image {
        flex: 0 0 200px;
      }
    </style>
  `;
};
export const Static = Template.bind({});
