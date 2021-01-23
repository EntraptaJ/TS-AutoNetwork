// src/Modues/Network/NetworkSchema.ts
import jsonSchema from 'fluent-json-schema';

export const networkSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('Network')
  .prop('prefix', jsonSchema.string().description('Network Prefix'))
  .prop('description', jsonSchema.string())
  .prop('circuit', jsonSchema.ref('#/definitions/networkcircuit'))
  .prop('contactId', jsonSchema.string().description('Contact ID'))
  .prop(
    'hosts',
    jsonSchema.array().items(jsonSchema.ref('#/definitions/networkHost')),
  )
  .prop(
    'ranges',
    jsonSchema.array().items(jsonSchema.ref('#/definitions/networkRange')),
  )
  .prop(
    'networks',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/network'))
      .uniqueItems(true)
      .description('Children Networks'),
  );
