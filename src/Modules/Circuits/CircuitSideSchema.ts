// src/Modules/Circuits/CircuitSideSchema.ts
import jsonSchema from 'fluent-json-schema';

export const circuitSideSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .prop(
    'id',
    jsonSchema.string().description('Circuit Location Id').required(),
  );
