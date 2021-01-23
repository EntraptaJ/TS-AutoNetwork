// src/Modules/Network/NetworkRangeSchema.ts
import jsonSchema from 'fluent-json-schema';
import { NetworkRangeType } from './NetworkRangeType';

export const networkRangeSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('Network Range')
  .prop('start', jsonSchema.string().required())
  .prop('end', jsonSchema.string().required())
  .prop('description', jsonSchema.string())
  .prop('type', jsonSchema.string().enum(Object.values(NetworkRangeType)));
