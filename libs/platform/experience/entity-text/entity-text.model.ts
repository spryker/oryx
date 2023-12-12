// will be reused by all entity field components
export interface EntityFieldOptions {
  entity?: string;
  field?: string;
}

export interface FieldTextOptions extends EntityFieldOptions {}
