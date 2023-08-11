import { ExperienceComponent } from "@spryker-oryx/experience";

export const contactPage: ExperienceComponent = {
  merge: {
    selector: '#contact-page.oryx-content-link',
    type: 'patch'
  },
  content: {
    data: {
      text: 'This is B2B Contact Page element. Remove me when the page is implemented',
    },
  },
};
