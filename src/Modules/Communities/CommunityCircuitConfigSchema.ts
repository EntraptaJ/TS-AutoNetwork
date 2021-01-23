// src/Modules/CommunityCircuits/CommunityCircuitConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

const communityCircuitSideSchema = jsonSchema
  .object()
  .prop('id', jsonSchema.string().description('Circuit Location Id'));

export const communityCircuitConfigSchema = jsonSchema
  .object()
  .description('Community Circuit')
  .prop('id', jsonSchema.string().description('Circuit ID').required())
  .prop('sideA', communityCircuitSideSchema)
  .prop('sideZ', communityCircuitSideSchema)
  .prop('speed', jsonSchema.string());
