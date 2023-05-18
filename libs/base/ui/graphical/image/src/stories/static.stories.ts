import { getAppGraphics } from '@spryker-oryx/ui';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Graphical/Image`,
} as Meta;

const Template: Story = (): TemplateResult => {
  const graphics = getAppGraphics();
  const graphic = graphics[0];
  const images = [
    'https://d2s0ynfc62ej12.cloudfront.net/b2c/29889537_4485.jpg',
    'https://d2s0ynfc62ej12.cloudfront.net/b2c/30521602_2938.jpg',
    'https://images.icecat.biz/img/norm/medium/24495843-7844.jpg',
    'incorrect-src',
  ];
  const colorSections = [
    {
      title: 'Inherited current colors',
      style: 'color: red;',
      images: [{}, {}, {}, {}, {}],
    },
    {
      title: 'Current color',
      images: [
        { style: 'color: var(--oryx-color-primary-100);' },
        { style: 'color: var(--oryx-color-primary-200);' },
        { style: 'color: var(--oryx-color-primary-300);' },
        { style: 'color: var(--oryx-color-primary-400);' },
        { style: 'color: var(--oryx-color-primary-500);' },
      ],
    },
    {
      title: 'Background color',
      images: [
        {
          style:
            'color: var(--oryx-color-primary-100);background-color: var(--oryx-color-primary-500);',
        },
        {
          style:
            'color: var(--oryx-color-primary-200);background-color: var(--oryx-color-primary-400);',
        },
        {
          style:
            'color: var(--oryx-color-primary-300);background-color: var(--oryx-color-primary-200);',
        },
        {
          style:
            'color: var(--oryx-color-primary-400);background-color: var(--oryx-color-primary-200);',
        },
        {
          style:
            'color: var(--oryx-color-primary-500);background-color: var(--oryx-color-primary-100);',
        },
      ],
    },
  ];

  return html`
    <h1>List</h1>
    <section class="wrapper">
      <div>
        <h2>By resource</h2>

        ${graphics.map(
          (type) =>
            html`
              <div class="image">
                <h3>${type}</h3>
                <oryx-image resource=${type}></oryx-image>
              </div>
            `
        )}

        <div class="image">
          <h3>Incorrect token</h3>
          <oryx-image resource="not-available.jpg"></oryx-image>
        </div>
      </div>

      <div>
        <h2>By src</h2>

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

    <h1>Colors</h1>
    ${colorSections.map(
      (section) => html`
        <h2>${section.title}</h2>
        <div class="image-set" .style=${section.style}>
          ${section.images.map(
            (image) => html`
              <oryx-image
                .resource=${graphic}
                .style=${(image as { style?: string }).style}
              ></oryx-image>
            `
          )}
        </div>
      `
    )}
    <style>
      .wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .wrapper > div {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0 40px;
      }

      h1,
      h2,
      h3 {
        padding: 20px 0;
        margin: 0;
      }

      h2 {
        grid-column: 1 / -1;
      }

      .image {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .image-set {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 50px;
      }

      oryx-image {
        display: block;
        max-height: 100px;
      }
    </style>
  `;
};

export const Static = Template.bind({});
