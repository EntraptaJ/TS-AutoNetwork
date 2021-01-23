// src/Modules/CommunityContacts/CommunityContactConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

export const communityContactConfigSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .id('#contact')
  .description('Community Contact')
  .prop('id', jsonSchema.string().description('Unique contact ID').required())
  .prop(
    'name',
    jsonSchema.string().description('Contact Full Name').required(),
  );
