import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../index';

export default {
  title: `${storybookPrefix}/actions/Link/link-variations`,
} as Meta;

const variations = [
  {
    name: 'default',
    state: '',
    lightDomState: '',
  },
  {
    name: 'hovered',
    state: 'pseudo-hover',
    lightDomState: '',
  },
  {
    name: 'active',
    state: 'pseudo-hover',
    lightDomState: 'pseudo-focus',
  },
  {
    name: 'focused',
    state: 'pseudo-hover ',
    lightDomState: 'pseudo-focus pseudo-focus-visible',
  },
  {
    name: 'disabled',
    state: '',
    lightDomState: '',
  },
  {
    name: 'long text',
    state: '',
    lightDomState: '',
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    ${variations.map((variant) => {
      const isDisabled = variant.name === 'disabled';
      const isLongText = variant.name === 'long text';
      const text = isLongText
        ? {
            link: 'www.link-example.com/some-long-text-here-some-long-text-here-some-long-text-here',
            externalLink:
              'www.link-example.com/some-long-text-here-some-long-text-here-some-long-text-here',
          }
        : {
            link: 'Link',
            externalLink: 'www.linkexample.com',
          };

      return html`
        <div class="row">
          <div class="col variant">
            <span>${variant.name}</span>
          </div>
          <div class="col ${variant.state}">
            <oryx-link
              ?disabled=${isDisabled}
              linkType="link"
              @click=${(e: Event): void => e.preventDefault()}
              class="${isLongText ? 'long-text' : ''}"
            >
              <a href="/" class="${variant.lightDomState}">${text.link}</a>
            </oryx-link>
          </div>
          <div class="col ${variant.state}">
            <oryx-link linkType="external" icon="link" ?disabled=${isDisabled}>
              <a
                href="/"
                class="${variant.lightDomState} ${isLongText
                  ? 'long-text'
                  : ''}"
                >${text.externalLink}</a
              >
            </oryx-link>
          </div>
        </div>
      `;
    })}

    <style>
      .row {
        display: flex;
        align-items: center;
        gap: 40px;
        margin-bottom: 24px;
      }
      .col {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .col.variant {
        width: 100px;
        color: #71747c;
      }
      .long-text {
        width: 200px;
      }
    </style>
  `;
};

export const VisualVariations = Template.bind({});
