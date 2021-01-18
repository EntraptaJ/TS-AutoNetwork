// src/Modues/IPAddresses/IPAddressSchema.ts
import jsonSchema from 'fluent-json-schema';

export const IPAddressSchema = jsonSchema
  .object()
  .description('IP Address')
  .prop('ip-address', jsonSchema.string().description('IP Address'))
  .prop('subnet-mask', jsonSchema.string().description('Subnet mask'));
