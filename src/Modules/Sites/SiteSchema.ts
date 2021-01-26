// src/Modules/Sites/SiteSchema.ts
import jsonSchema from 'fluent-json-schema';
import { SiteType } from './SiteType';

export const siteSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('Community Site')
  .prop('id', jsonSchema.string().description('Site short id').required())
  .prop('name', jsonSchema.string().required())
  .prop('type', jsonSchema.string().enum(Object.values(SiteType)))
  .prop(
    'devices',
    jsonSchema.array().items(jsonSchema.ref('#/definitions/device')),
  );
