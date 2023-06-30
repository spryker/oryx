import { InputType } from '@storybook/csf';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

const itemsCount = 5;

const generateArgs = (sectionsCount: number) => {
  const result: any = {};

  [...Array(sectionsCount).keys()].forEach((i) => {
    const number = i + 1;
    result[`menuHeading_${number}`] = `Heading ${number}`;
    result[`menuSubtitle_${number}`] = `Subtitle ${number}`;
    result[`sectionHeading_${number}`] = `Section ${number}`;
    result[`sectionContent_${number}`] = 50;
  });

  return result;
};

export default {
  title: `${storybookPrefix}/Navigations/Page navigation`,
  args: {
    disableNavigation: false,
    sectionsContainerWidth: 80,
    sectionsContainerHeight: 80,
    ...generateArgs(itemsCount),
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props {
  [key: string]: string;
}

const sectionContent =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor rutrum rutrum. Nam rhoncus faucibus auctor. Aenean porttitor tristique nisi. Integer hendrerit convallis vulputate. Maecenas ac fringilla quam, id mollis mi. Quisque a nibh eget turpis fermentum vulputate in vel dui. Suspendisse potenti. Donec porta lorem at venenatis scelerisque. Morbi quis rutrum ex. Integer non venenatis justo, ut efficitur erat. Phasellus tempor lorem ut semper feugiat. Cras efficitur hendrerit nulla vel viverra. Duis maximus, lacus quis viverra fermentum, est leo euismod arcu, nec tempus eros urna ac sapien. Proin convallis magna ex. Donec vitae massa ac quam congue imperdiet in non turpis. Sed sodales auctor nisi. Nullam finibus urna nec sem molestie aliquet. Vivamus consectetur tincidunt lacus a suscipit. Donec tincidunt nibh a elit scelerisque cursus. Nulla aliquam fringilla tortor commodo eleifend. Fusce vitae mi eget mi cursus interdum a in dui. Curabitur est nulla, vestibulum quis mollis sed, malesuada nec enim. In mi dolor, bibendum pellentesque pellentesque vel, iaculis ac ante. In non pellentesque est. Integer tincidunt nisi et placerat vestibulum. Suspendisse nec odio turpis. Ut varius mauris nunc, non egestas eros rutrum ac. Vestibulum condimentum tempus orci, finibus varius odio molestie ac. Fusce egestas neque quis purus bibendum viverra. Mauris et pharetra magna, tempus mollis urna. Curabitur id lacus sit amet purus imperdiet laoreet vel in turpis. Integer bibendum in tortor sit amet suscipit. Quisque quis sagittis est. Morbi ex orci, eleifend vitae sollicitudin et, scelerisque eget sapien. Donec nec ex eu elit luctus pretium quis vel risus. Mauris vulputate lacus vitae gravida porta. Proin elementum metus suscipit malesuada porttitor. Nam sollicitudin molestie augue, quis venenatis tortor sodales in. Sed elementum orci non massa eleifend, eu viverra dolor tristique. Fusce eleifend consectetur massa ac porta. Quisque nec enim porttitor, faucibus ex nec, placerat urna. Donec quis commodo nunc. Morbi imperdiet vulputate odio eget aliquam. Mauris lacinia tellus enim, et posuere ipsum pharetra at. Maecenas non feugiat sapien. Integer sit amet nibh neque. Curabitur eget neque augue. Aliquam vitae tellus eu nunc pellentesque consequat eget in tellus. Nunc ut massa sed orci sodales imperdiet at laoreet ligula. Fusce magna tellus, molestie cursus orci quis, tempor rutrum sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tempor rutrum rutrum. Nam rhoncus faucibus auctor. Aenean porttitor tristique nisi. Integer hendrerit convallis vulputate. Maecenas ac fringilla quam, id mollis mi. Quisque a nibh eget turpis fermentum vulputate in vel dui. Suspendisse potenti. Donec porta lorem at venenatis scelerisque. Morbi quis rutrum ex. Integer non venenatis justo, ut efficitur erat. Phasellus tempor lorem ut semper feugiat. Cras efficitur hendrerit nulla vel viverra. Duis maximus, lacus quis viverra fermentum, est leo euismod arcu, nec tempus eros urna ac sapien. Proin convallis magna ex. Donec vitae massa ac quam congue imperdiet in non turpis. Sed sodales auctor nisi. Nullam finibus urna nec sem molestie aliquet. Vivamus consectetur tincidunt lacus a suscipit. Donec tincidunt nibh a elit scelerisque cursus. Nulla aliquam fringilla tortor commodo eleifend. Fusce vitae mi eget mi cursus interdum a in dui. Curabitur est nulla, vestibulum quis mollis sed, malesuada nec enim. In mi dolor, bibendum pellentesque pellentesque vel, iaculis ac ante. In non pellentesque est. Integer tincidunt nisi et placerat vestibulum. Suspendisse nec odio turpis. Ut varius mauris nunc, non egestas eros rutrum ac. Vestibulum condimentum tempus orci, finibus varius odio molestie ac. Fusce egestas neque quis purus bibendum viverra. Mauris et pharetra magna, tempus mollis urna. Curabitur id lacus sit amet purus imperdiet laoreet vel in turpis. Integer bibendum in tortor sit amet suscipit. Quisque quis sagittis est. Morbi ex orci, eleifend vitae sollicitudin et, scelerisque eget sapien. Donec nec ex eu elit luctus pretium quis vel risus. Mauris vulputate lacus vitae gravida porta. Proin elementum metus suscipit malesuada porttitor. Nam sollicitudin molestie augue, quis venenatis tortor sodales in. Sed elementum orci non massa eleifend, eu viverra dolor tristique. Fusce eleifend consectetur massa ac porta. Quisque nec enim porttitor, faucibus ex nec, placerat urna. Donec quis commodo nunc. Morbi imperdiet vulputate odio eget aliquam. Mauris lacinia tellus enim, et posuere ipsum pharetra at. Maecenas non feugiat sapien. Integer sit amet nibh neque. Curabitur eget neque augue. Aliquam vitae tellus eu nunc pellentesque consequat eget in tellus. Nunc ut massa sed orci sodales imperdiet at laoreet ligula. Fusce magna tellus, molestie cursus orci quis, tempor rutrum sem.';

interface ArgTypes {
  [key: string]: InputType;
}

const generateArgTypes = (sectionsCount: number): ArgTypes => {
  const result: ArgTypes = {};

  [...Array(sectionsCount).keys()].forEach((i) => {
    const number = i + 1;

    result[`menuHeading_${number}`] = {
      table: { category: `Section ${number}` },
      name: 'Menu heading',
      control: {
        type: 'text',
      },
    };

    result[`menuSubtitle_${number}`] = {
      table: { category: `Section ${number}` },
      name: 'Menu content',
      control: {
        type: 'text',
      },
    };

    result[`sectionHeading_${number}`] = {
      table: { category: `Section ${number}` },
      name: 'Section heading',
      control: {
        type: 'text',
      },
    };

    result[`sectionContent_${number}`] = {
      table: { category: `Section ${number}` },
      name: 'Section content (%)',
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
    };
  });

  return result;
};

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`
    <div style="display: flex">
      <div style="width: 70%">
        <div class="scroll-container">
          ${[...Array(itemsCount).keys()].map((i) => {
            const number = i + 1;
            return html`
              <section id="some-id-${number}">
                <h2>${props[`sectionHeading_${number}`]}</h2>
                <p>
                  ${sectionContent.substring(
                    0,
                    (sectionContent.length *
                      Number(props[`sectionContent_${number}`])) /
                      100
                  )}
                </p>
              </section>
            `;
          })}
        </div>
      </div>
      <div style="width: 30%; padding: 0 5px">
        <div style="position: sticky; top: 0">
          <oryx-page-navigation
            ?disableNavigation=${props.disableNavigation}
            sectionsContainerSelector=".scroll-container"
            @section-change=${({
              detail: { id },
            }: {
              detail: { id: string };
            }): void => {
              console.log('current section id', id);
            }}
          >
            ${[...Array(itemsCount).keys()].map((i) => {
              const number = i + 1;
              return html`
                <oryx-page-navigation-item
                  targetId="some-id-${number}"
                  tabindex="0"
                >
                  ${props[`menuHeading_${number}`]}
                  <span slot="content">${props[`menuSubtitle_${number}`]}</span>
                </oryx-page-navigation-item>
              `;
            })}
          </oryx-page-navigation>
        </div>
      </div>
    </div>

    <style>
      .scroll-container {
        scroll-behavior: smooth;
        width: ${props.sectionsContainerWidth}%;
        height: calc(${props.sectionsContainerHeight}vh - 28px);
        overflow: auto;
        margin: auto;
        border: 1px solid #000000;
        position: relative;
      }
      h2 {
        margin-top: 0;
      }
    </style>
  `;
};

export const PageNavigationDemo = Template.bind({});

PageNavigationDemo.argTypes = {
  disableNavigation: {
    table: { category: 'Props' },
  },
  sectionsContainerWidth: {
    name: 'Width (%)',
    table: { category: 'Sections container' },
    control: {
      type: 'range',
      min: 0,
      max: 100,
      step: 5,
    },
  },
  sectionsContainerHeight: {
    name: 'Height (%)',
    table: { category: 'Sections container' },
    control: {
      type: 'range',
      min: 0,
      max: 100,
      step: 5,
    },
  },
  ...generateArgTypes(itemsCount),
};
