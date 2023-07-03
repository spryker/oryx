import { generateVariantsMatrix, Variant } from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigations/Page navigation/Static`,
} as Meta;

interface PageNavigationVariant extends Variant {
  options: {
    itemsCount: number;
    longSubtitleIndex?: number;
    noSubtitleIndex?: number;
  };
}

const variants: PageNavigationVariant[] = [
  {
    categoryY: '',
    categoryX: 'Single',
    options: {
      itemsCount: 1,
    },
  },
  {
    categoryY: '',
    categoryX: 'Two items',
    options: {
      itemsCount: 2,
    },
  },
  {
    categoryY: '',
    categoryX: 'Multiple items',
    options: {
      itemsCount: 4,
      noSubtitleIndex: 1,
      longSubtitleIndex: 2,
    },
  },
];

const heading = `Heading`;
const shortSubtitle = `Subtitle`;
const longSubtitle =
  'This is content. It can be used for description. This is content. It can be used for description. This is content. It can be used for description. This is content. It can be used for description. This is content. It can be used for description.';

const Template: Story<undefined> = (): TemplateResult => {
  return generateVariantsMatrix(
    variants,
    ({
      options: { itemsCount, longSubtitleIndex, noSubtitleIndex },
      categoryX,
    }) => html`
      <div style="width: 240px;">
        <oryx-page-navigation aria-label=${categoryX}>
          ${[...Array(itemsCount).keys()].map(
            (num) =>
              html`
                <oryx-page-navigation-item targetId="some-id-${num + 1}">
                  ${`${heading} ${num + 1}`}
                  <span slot="content">
                    ${longSubtitleIndex === num
                      ? longSubtitle
                      : noSubtitleIndex === num
                      ? ''
                      : shortSubtitle}
                  </span>
                </oryx-page-navigation-item>
              `
          )}
        </oryx-page-navigation>
      </div>
    `
  );
};

export const ItemsCountVariants = Template.bind({});
