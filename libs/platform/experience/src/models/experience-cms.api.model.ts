import { ExperienceQualifier } from './experience-qualifier';
import { Component } from './experience.model';

export module ApiExperienceCmsModel {
  export interface Response {
    items: {
      sys: {
        contentType: { sys: { id: string } };
      };
      fields: {
        data: Omit<Component, 'id'>;
        id: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
      };
    }[];
  }

  export interface Model {
    data: Response;
    qualifier: ExperienceQualifier;
  }
}
