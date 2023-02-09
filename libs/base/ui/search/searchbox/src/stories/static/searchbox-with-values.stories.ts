import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { initMutationObserverForComponent } from '../../../../../src/utilities';

export default {
  title: `${storybookPrefix}/Search/Searchbox/Static`,
} as Meta;

const variations = [
  {
    name: 'Default',
    state: '',
    lightDomState: '',
  },
  {
    name: 'Hovered',
    state: 'pseudo-hover',
    lightDomState: 'pseudo-hover',
  },
  {
    name: 'Focused',
    state: 'pseudo-focus-within',
    lightDomState: 'pseudo-focus-within',
  },
  {
    name: 'Disabled',
    state: '',
    lightDomState: '',
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    <h1>With content</h1>
    <div class="searchbox-component">
      ${variations.map((variant) => {
        const isDisabled = variant.name === 'Disabled';
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search searchIcon="search">
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <script>
      ${initMutationObserverForComponent({
        targetComponent: 'oryx-search',
        targetSelector: '.control',
        sourceSelector: 'input',
      })};
    </script>

    <style>
      .variation-searchbox {
        display: flex;
        margin-bottom: 20px;
        gap: 20px;
        align-items: center;
      }

      .variation-searchbox oryx-search {
        width: 100%;
      }

      .variation-searchbox p {
        width: 100px;
      }
    </style>
  `;
};
export const StatesWithValues = Template.bind({});
