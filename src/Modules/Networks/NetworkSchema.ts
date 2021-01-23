// src/Modues/Network/NetworkSchema.ts
import jsonSchema from 'fluent-json-schema';
import { networkHostSchema } from './NetworkHostSchema';
import { networkRangeSchema } from './NetworkRangeSchema';

export const networkSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('Network')
  .prop('prefix', jsonSchema.string().description('Network Prefix'))
  .prop('description', jsonSchema.string())
  .prop('circuit', jsonSchema.ref('#/definitions/networkcircuit'))
  .prop('contact', jsonSchema.string().description('Contact ID'))
  .prop('hosts', jsonSchema.array().items(networkHostSchema))
  .prop('ranges', jsonSchema.array().items(networkRangeSchema))
  .prop(
    'networks',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/network'))
      .uniqueItems(true)
      .description('Children Networks'),
  );
