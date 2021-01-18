// src/Modules/NetworkDevices/NetworkDeviceInterfaceConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { IPAddressSchema } from '../IPAddresses/IPAddressSchema';
import { NetworkDeviceInterfaceType } from './NetworkDeviceInterfaceType';

export const networkDeviceInterfaceConfigSchema = jsonSchema
  .object()
  .description('Network Interface')
  .prop('name', jsonSchema.string().description('Network Interface Name/ID'))
  .prop(
    'interface-speed',
    jsonSchema.string().enum(Object.values(NetworkDeviceInterfaceType)),
  )
  .prop('description', jsonSchema.string())
  .prop('ip-address', IPAddressSchema.description('Interface IP Address'));
