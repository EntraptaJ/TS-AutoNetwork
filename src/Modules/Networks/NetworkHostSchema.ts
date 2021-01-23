// src/Modules/Network/NetworkHostSchema.ts
import jsonSchema from 'fluent-json-schema';

export const networkHostSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('Indivual Network host')
  .prop(
    'ip',
    jsonSchema
      .string()
      .description('Host IP Address')
      .format(jsonSchema.FORMATS.IPV4)
      .required(),
  )
  .prop(
    'hostname',
    jsonSchema
      .string()
      .description('Hostname for reverse DNS creation')
      .format(jsonSchema.FORMATS.HOSTNAME),
  )
  .prop('description', jsonSchema.string())
  .prop('device', jsonSchema.ref('#/definitions/networkDeviceLink'));
