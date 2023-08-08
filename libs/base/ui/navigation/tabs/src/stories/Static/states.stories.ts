import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { TabsAppearance, TabsProperties } from '../../..';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigations/Tabs/Static`,
  args: {},
  argTypes: {},
} as Meta;

enum CategoryX {
  Default = 'Default',
  Hovered = 'Hovered',
  Selected = 'Selected',
  Error = 'Error',
  HoveredError = 'Hovered error',
  SelectedError = 'Selected error',
}

enum CategoryY {
  Primary = 'Primary',
  PrimaryWithShadow = 'Primary with shadow',
  Secondary = 'Secondary',
  SecondaryWithShadow = 'Secondary with shadow',
}

interface TabVariant extends Variant {
  options: {
    className?: string;
    error?: boolean;
    selected?: boolean;
    shadow?: boolean;
    appearance: string;
  };
}

const primaryVariants: TabVariant[] = [
  {
    categoryX: CategoryX.Default,
    categoryY: CategoryY.Primary,
    options: {
      appearance: TabsAppearance.Primary,
    },
  },
  {
    categoryX: CategoryX.Hovered,
    categoryY: CategoryY.Primary,
    options: {
      className: 'pseudo-hover',
      appearance: TabsAppearance.Primary,
    },
  },
  {
    categoryX: CategoryX.Selected,
    categoryY: CategoryY.Primary,
    options: {
      selected: true,
      appearance: TabsAppearance.Primary,
    },
  },
  {
    categoryX: CategoryX.Error,
    categoryY: CategoryY.Primary,
    options: {
      error: true,
      appearance: TabsAppearance.Primary,
    },
  },
  {
    categoryX: CategoryX.HoveredError,
    categoryY: CategoryY.Primary,
    options: {
      className: 'pseudo-hover',
      error: true,
      appearance: TabsAppearance.Primary,
    },
  },
  {
    categoryX: CategoryX.SelectedError,
    categoryY: CategoryY.Primary,
    options: {
      selected: true,
      error: true,
      appearance: TabsAppearance.Primary,
    },
  },
];

const getSecondaryVariants = (): TabVariant[] =>
  primaryVariants.map((variant) => ({
    ...variant,
    options: {
      ...variant.options,
      appearance: TabsAppearance.Secondary,
    },
    categoryY: CategoryY.Secondary,
  }));

const getShadowVariants = (): TabVariant[] => [
  ...primaryVariants.map((variant) => ({
    ...variant,
    options: {
      ...variant.options,
      shadow: true,
    },
    categoryY: CategoryY.PrimaryWithShadow,
  })),
  ...getSecondaryVariants().map((variant) => ({
    ...variant,
    options: {
      ...variant.options,
      shadow: true,
    },
    categoryY: CategoryY.SecondaryWithShadow,
  })),
];

const Template: Story<TabsProperties> = (): TemplateResult => {
  return html`
    ${generateVariantsMatrix(
      [...primaryVariants, ...getSecondaryVariants(), ...getShadowVariants()],
      ({ options: { className, selected, error, shadow, appearance } }) => html`
        <div class=${className}>
          <oryx-tabs
            appearance=${appearance}
            activeTabIndex=${selected && 1}
            ?shadow=${shadow}
          >
            <oryx-tab> Invisible tab </oryx-tab>
            <oryx-tab ?error=${error}> Tab </oryx-tab>
          </oryx-tabs>
        </div>
      `,
      {
        axisYOrder: [
          CategoryY.Primary,
          CategoryY.PrimaryWithShadow,
          CategoryY.Secondary,
          CategoryY.SecondaryWithShadow,
        ],
      }
    )}

    <style>
      oryx-tabs oryx-tab:first-child {
        display: none;
      }
    </style>
  `;
};

export const States = Template.bind({});
