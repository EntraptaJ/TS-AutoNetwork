// src/Modules/CommunityCircuits/CommunityCircuitLocationSchema.ts
import jsonSchema from 'fluent-json-schema';
import { CommunityCircuitSpeed } from './CommunityCircuitSpeed';

export const circuitLocationSchema = jsonSchema
  .object()
  .description('Traditional external circuits')
  .prop('id', jsonSchema.string().description('External circuit id'))
  .prop(
    'provider',
    jsonSchema.string().description('External circuit provider'),
  )
  .prop('communuity', jsonSchema.string().description('Community ID'))
  .prop(
    'address',
    jsonSchema.string().description('Address provided to external provider'),
  )
  .prop(
    'demarcSpeed',
    jsonSchema.string().enum(Object.values(CommunityCircuitSpeed)),
  );
