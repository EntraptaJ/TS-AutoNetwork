// src/Modules/CommunityContacts/CommunityContactConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

export const contactSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .id('#contact')
  .description('Community Contact')
  .prop('id', jsonSchema.ref('#/definitions/contactId').required())
  .prop(
    'name',
    jsonSchema.string().description('Contact Full Name').required(),
  );
