import { ExperienceCompositionComponent } from './experience-composition.component';
export * from './experience-composition-preview.component';
export * from './experience-composition.component';

customElements.get('experience-composition') ||
  customElements.define(
    'experience-composition',
    ExperienceCompositionComponent
  );
