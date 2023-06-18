import { initMutationObserverForComponent } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import {
  ClearIconAppearance,
  ClearIconPosition,
  SearchIconPosition,
} from '../../searchbox.model';

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

const isDisabled = (variant: any) => variant.name === 'Disabled';

const Template: Story = (): TemplateResult => {
  return html`
    <h2>Default</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search>
              <input
                placeholder="Search..."
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>With content</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search>
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>Truncated content</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox-truncated">
            <p>${variant.name}</p>
            <oryx-search>
              <input
                placeholder="Search..."
                value="Long text searchbox"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>Without search button</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search searchIconPosition=${SearchIconPosition.None}>
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>Search button in suffix</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search searchIconPosition=${SearchIconPosition.Suffix}>
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>Clear button appearance hover</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search clearIconAppearance=${ClearIconAppearance.Hover}>
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>Clear button appearance hover and search button in suffix</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search
              searchIconPosition=${SearchIconPosition.Suffix}
              clearIconAppearance=${ClearIconAppearance.Hover}
            >
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>
      Clear button appearance hover and position suffix, search button in suffix
    </h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search
              clearIconPosition=${ClearIconPosition.Suffix}
              searchIconPosition=${SearchIconPosition.Suffix}
              clearIconAppearance=${ClearIconAppearance.Hover}
            >
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>
      Clear button appearance toggle and position suffix, search button in
      suffix
    </h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search
              clearIconPosition=${ClearIconPosition.Suffix}
              searchIconPosition=${SearchIconPosition.Suffix}
              clearIconAppearance=${ClearIconAppearance.Toggle}
            >
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
                class="${variant.lightDomState}"
              />
            </oryx-search>
          </div>
        `;
      })}
    </div>

    <h2>Without clear button</h2>
    <div>
      ${variations.map((variant) => {
        return html`
          <div class="variation-searchbox">
            <p>${variant.name}</p>
            <oryx-search clearIconPosition=${ClearIconPosition.None}>
              <input
                placeholder="Search..."
                value="Value"
                ?disabled=${isDisabled(variant)}
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

      .variation-searchbox-truncated oryx-search {
        width: 200px;
      }

      .variation-searchbox p {
        width: 100px;
      }
    </style>
  `;
};
export const Variants = Template.bind({});
