// will be reused by all entity field components
export interface EntityFieldOptions {
  entity?: string;
  field?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FieldTextOptions extends EntityFieldOptions {}
