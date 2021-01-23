// src/Modules/CommunitySites/CommunitySiteConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

export const communitySiteConfigSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('Community Site')
  .prop('id', jsonSchema.string().description('Site short id').required())
  .prop('name', jsonSchema.string().required())
  .prop(
    'devices',
    jsonSchema.array().items(jsonSchema.ref('#/definitions/device')),
  );
