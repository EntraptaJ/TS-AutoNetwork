// src/Modules/CommunitySites/CommunitySiteConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { communityCircuitConfigSchema } from '../CommunityCircuits/CommunityCircuitConfigSchema';
import { networkDeviceConfigSchema } from '../NetworkDevices/NetworkDeviceConfigSchema';

export const communitySiteConfigSchema = jsonSchema
  .object()
  .description('Community Site')
  .prop('id', jsonSchema.string().description('Site short id').required())
  .prop(
    'devices',
    jsonSchema
      .array()
      .items(
        networkDeviceConfigSchema.prop('circuit', communityCircuitConfigSchema),
      ),
  );
