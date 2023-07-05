import { OryxIdentifier } from './identifier.model';

export interface OryxFeature extends OryxIdentifier {
  id: string;
  name: string;
  description?: string;
  identifier: string;
  isPreset?: boolean;
  dependencies?: string[];
}
