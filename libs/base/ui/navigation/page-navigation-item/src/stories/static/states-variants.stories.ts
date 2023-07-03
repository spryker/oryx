import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigations/Page navigation item/Static`,
} as Meta;

const types = ['Without content', 'With content', 'Truncated heading'];

interface PageNavigationItemVariant extends Variant {
  options: {
    className?: string;
    selected?: boolean;
  };
}

enum CategoryY {
  NOT_SELECTED = 'Not selected',
  SELECTED = 'Selected',
}
enum CategoryX {
  DEFAULT = 'Default',
  HOVERED = 'Hovered',
  FOCUSED = 'Focused',
}

const variants: PageNavigationItemVariant[] = [
  {
    categoryY: CategoryY.NOT_SELECTED,
    categoryX: CategoryX.DEFAULT,
    options: {},
  },
  {
    categoryY: CategoryY.SELECTED,
    categoryX: CategoryX.DEFAULT,
    options: {
      selected: true,
    },
  },
  {
    categoryY: CategoryY.NOT_SELECTED,
    categoryX: CategoryX.HOVERED,
    options: {
      className: 'pseudo-hover',
    },
  },
  {
    categoryY: CategoryY.SELECTED,
    categoryX: CategoryX.HOVERED,
    options: {
      className: 'pseudo-hover',
      selected: true,
    },
  },
  {
    categoryY: CategoryY.NOT_SELECTED,
    categoryX: CategoryX.FOCUSED,
    options: {
      className: 'pseudo-focus pseudo-focus-visible',
    },
  },
  {
    categoryY: CategoryY.SELECTED,
    categoryX: CategoryX.FOCUSED,
    options: {
      className: 'pseudo-focus pseudo-focus-visible',
      selected: true,
    },
  },
];

const Template: Story = (): TemplateResult => {
  return html`
    ${types.map(
      (type) => html`
        <h2>${type}</h2>

        ${generateVariantsMatrix(
          variants,
          ({ options: { className, selected } }) => html`
            <div style="width: 160px;" class=${className}>
              <oryx-page-navigation-item ?active=${selected}>
                ${type === 'Truncated heading' ? 'Too long heading' : 'Title'}
                <span slot="content"
                  >${type === 'With content' ? 'Subtitle' : ''}</span
                >
              </oryx-page-navigation-item>
            </div>
          `
        )}
      `
    )}
  `;
};

export const StatesVariants = Template.bind({});
