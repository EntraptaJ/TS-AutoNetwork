// src/Modules/NetworkDevices/NetworkDeviceConfigSchema.ts
import jsonSchema from 'fluent-json-schema';

export const networkDeviceConfigSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .id('#device')
  .description('Network Device')
  .prop('id', jsonSchema.string().description('Chained ID').required())
  .prop('name', jsonSchema.string().description('Friendly name').required())
  .prop('type', jsonSchema.ref('#/definitions/networkDeviceType'));
