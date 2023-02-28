import { LandingPage } from '../support/page_objects/landing.page';

const landingPage = new LandingPage();

describe('Landing page spec', () => {
  it('HRZ-770 | should open Landing page', () => {
    landingPage.visit();
  });
});
