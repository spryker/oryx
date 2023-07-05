import { OryxIdentifier } from './identifier.model';

export interface OryxTheme extends OryxIdentifier {
  id: string;
  name: string;
  description?: string;
  identifier: string;
}
