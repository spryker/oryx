import { ApplicationConfig, ApplicationType, Feature, Preset } from '../models';

export class ApplicationCliService {
  protected readonly applicationConfigs: ApplicationConfig[] = [
    {
      type: ApplicationType.Storefront,
      presets: [Preset.B2C, Preset.B2B],
      features: [Feature.Labs],
    },
    {
      type: ApplicationType.Fulfillment,
      features: [Feature.Labs],
    },
  ];

  getApplicationConfig(type: ApplicationType): ApplicationConfig | undefined {
    return this.applicationConfigs.find((config) => config.type === type);
  }

  getFeatures(type: ApplicationType): Feature[] {
    return this.getApplicationConfig(type)?.features ?? [];
  }

  getPresets(type: ApplicationType): Preset[] {
    return this.getApplicationConfig(type)?.presets ?? [];
  }

  getApplicationTypes(): ApplicationType[] {
    const uniqueTypes = new Set<ApplicationType>();

    this.applicationConfigs.forEach((config) => {
      uniqueTypes.add(config.type);
    });

    return Array.from(uniqueTypes);
  }
}
