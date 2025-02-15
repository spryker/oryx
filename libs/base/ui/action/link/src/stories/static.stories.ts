import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Actions/Link/Static`,
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
    lightDomState: 'pseudo-active',
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
    name: 'truncated',
    state: '',
    lightDomState: '',
  },
  {
    name: 'multi-line',
    state: '',
    lightDomState: '',
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    ${variations.map((variant) => {
      const isDisabled = variant.name === 'disabled';
      const isLongText =
        variant.name === 'truncated' || variant.name === 'multi-line';
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
              ?singleLine=${variant.name === 'truncated'}
              linkType="link"
              @click=${(e: Event): void => e.preventDefault()}
              class="${isLongText ? 'truncated' : ''}"
            >
              <a href="/" class="${variant.lightDomState}">${text.link}</a>
            </oryx-link>
          </div>
          <div class="col ${variant.state}">
            <oryx-link
              linkType="external"
              icon="link"
              ?disabled=${isDisabled}
              ?singleLine=${variant.name === 'truncated'}
            >
              <a
                href="/"
                class="${variant.lightDomState} ${isLongText
                  ? 'truncated'
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
      .truncated {
        width: 200px;
      }
    </style>
  `;
};

export const States = Template.bind({});
