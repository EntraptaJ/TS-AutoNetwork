// src/Modules/CommunityCircuits/CommunityCircuitConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

export const circuitSchema = jsonSchema
  .object()
  .description('Community Circuit')
  .additionalProperties(false)
  .prop('id', jsonSchema.string().description('Circuit ID').required())
  .prop('sideA', jsonSchema.ref('#/definitions/circuitSide').required())
  .prop('sideZ', jsonSchema.ref('#/definitions/circuitSide').required())
  .prop('speed', jsonSchema.string());
