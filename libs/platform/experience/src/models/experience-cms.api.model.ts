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
      };
    }[];
  }
}
