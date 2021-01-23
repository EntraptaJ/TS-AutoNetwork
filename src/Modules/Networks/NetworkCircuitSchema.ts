// src/Modues/Network/NetworkCircuit.ts
import jsonSchema from 'fluent-json-schema';

export const networkCircuitSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('NetworkCircuit')
  .prop('id', jsonSchema.string().description('Circuit Id').required())
  .prop('speed', jsonSchema.string().description('Circuit Speed'));
