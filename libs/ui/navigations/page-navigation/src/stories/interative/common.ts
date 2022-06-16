import { html, TemplateResult } from 'lit';
import { getPageNavigation } from '../common';

export interface TemplateProps {
  sectionsCount: number;
  sectionHeight: number;
  viewportHeight: number;
}

export const getSections = (
  sectionsCount: number,
  sectionHeight: number
): TemplateResult => {
  return html`
    ${[...Array(sectionsCount).keys()].map((i) => {
      const number = i + 1;
      return html`
        <section id="link_${number}">
          <h2>Section ${number}</h2>
        </section>
      `;
    })}

    <style>
      section {
        height: ${sectionHeight}px;
      }
      section h2 {
        margin: 0;
      }
    </style>
  `;
};

export const getTemplate = ({
  sectionsCount,
  sectionHeight,
  viewportHeight,
}: TemplateProps): TemplateResult => {
  return html`
    <div style="display: flex">
      <div class="scroll-container" style="width: 70%; position: relative">
        ${getSections(sectionsCount, sectionHeight)}
      </div>
      <div style="width: 30%">
        ${getPageNavigation(sectionsCount, '.scroll-container')}
      </div>
    </div>

    <style>
      .scroll-container {
        height: ${viewportHeight}px;
        overflow: auto;
        border: 1px solid black;
      }
    </style>
  `;
};
