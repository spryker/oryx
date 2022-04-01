import { ExperienceComposition } from './experience-composition';
export * from './experience-composition';

customElements.get('experience-composition') ||
  customElements.define('experience-composition', ExperienceComposition);
