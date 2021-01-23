// src/Modules/Communities/CommunitySchema.ts
import jsonSchema from 'fluent-json-schema';

export const communitySchema = jsonSchema
  .object()
  .additionalProperties(false)
  .id('#community')
  .description('Community')
  .prop('contact', jsonSchema.string().description('Community Contact ID'))
  .prop(
    'name',
    jsonSchema.string().description('Community Friendly Name').required(),
  )
  .prop(
    'id',
    jsonSchema
      .string()
      .description('Short form community code')
      .examples(['sxl'])
      .required(),
  )
  .prop(
    'sites',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/communitySite'))
      .required(),
  );
