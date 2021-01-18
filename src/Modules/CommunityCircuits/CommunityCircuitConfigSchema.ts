// src/Modules/CommunityCircuits/CommunityCircuitConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { CommunityCircuitSpeed } from './CommunityCircuitSpeed';
import { networkDeviceInterfaceConfigSchema } from '../NetworkDevices/NetworkDeviceInterfaceConfigSchema';

export const communityCircuitConfigSchema = jsonSchema
  .object()
  .description('Community Circuit')
  .prop('id', jsonSchema.string().description('Circuit ID').required())
  .prop('parent-device', jsonSchema.string().description('Parent Device'))
  .prop('speed', jsonSchema.string().enum(Object.values(CommunityCircuitSpeed)))
  .prop(
    'local-interface',
    networkDeviceInterfaceConfigSchema.description(
      'Local Network Interface for Circuit termination',
    ),
  )
  .prop(
    'remote-interface',
    networkDeviceInterfaceConfigSchema.description(
      'Upstream Network Interface for Circuit termination',
    ),
  );
