// src/Modules/NetworkDevices/NetworkDeviceConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { NetworkDeviceType } from './NetworkDeviceType';

export const networkDeviceConfigSchema = jsonSchema
  .object()
  .description('Network Device')
  .prop('name', jsonSchema.string().description('Friendly name').required())
  .prop('type', jsonSchema.string().enum(Object.values(NetworkDeviceType)))
  .prop('hostname', jsonSchema.string().description('Primary Hostname/IP'));
