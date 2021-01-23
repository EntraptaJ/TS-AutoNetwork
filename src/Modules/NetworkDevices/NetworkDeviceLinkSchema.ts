// src/Modules/Network/NetworkDeviceLink.ts
import jsonSchema from 'fluent-json-schema';

export const networkDeviceLinkSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('Link a Network to a device')
  .prop('id', jsonSchema.string().description('Device id').required())
  .prop('interface', jsonSchema.string().description('Device interface'));
