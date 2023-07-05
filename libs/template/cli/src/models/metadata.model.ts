import { OryxComponent } from './component.model';
import { OryxFeature } from './feature.model';
import { OryxTheme } from './theme.model';

export interface OryxMetadata {
  name: string;
  features?: OryxFeature[];
  components?: OryxComponent[];
  themes?: OryxTheme[];
}
