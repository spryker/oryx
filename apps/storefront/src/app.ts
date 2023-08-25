import { appBuilder } from '@spryker-oryx/application';
import { labsFeatures } from '@spryker-oryx/labs';
import { b2bStorefrontFeatures } from '@spryker-oryx/presets/b2b-storefront';
import { storefrontFeaturesLatest } from '@spryker-oryx/presets/storefront';
import { storefrontTheme } from '@spryker-oryx/themes';
import {isOryxFeatureLevel, OryxFeatureLevel} from "@spryker-oryx/utilities";


const env = import.meta.env;

const features = [
  ...(env.ORYX_PRESET && env.ORYX_PRESET === 'b2b'
    ? b2bStorefrontFeatures
    : storefrontFeaturesLatest),
  ...(env.ORYX_LABS ? labsFeatures : []),
];

export const app = appBuilder()
  .withFeature(features)
  .withTheme([storefrontTheme])
  .withEnvironment(env)
  .create();

console.log('test123', OryxFeatureLevel);
const c = OryxFeatureLevel;
console.log('test124', c);


if (OryxFeatureLevel >= 110) {
  console.log('test222');
} else {
  console.log('test333');
}

if (isOryxFeatureLevel(110)) {
  console.log('test444');
} else {
  console.log('test555');
}
