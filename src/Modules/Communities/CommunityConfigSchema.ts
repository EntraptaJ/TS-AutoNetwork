// src/Modules/Communities/CommunityConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { communityCircuitConfigSchema } from '../CommunityCircuits/CommunityCircuitConfigSchema';
import { communitySiteConfigSchema } from '../CommunitySites/CommunitySiteConfigSchema';
import { networkDeviceConfigSchema } from '../NetworkDevices/NetworkDeviceConfigSchema';

const communitySchema = jsonSchema
  .object()
  .description('Community')
  .prop(
    'name',
    jsonSchema.string().description('Community Friendly Name').required(),
  )
  .prop(
    'id',
    jsonSchema
      .string()
      .description('Short form community code')
      .examples(['sxl'])
      .required(),
  )
  .prop(
    'sites',
    jsonSchema.array().items(communitySiteConfigSchema).required(),
  );

export const communityConfigSchema = jsonSchema
  .object()
  .description('Community Configuration File')
  .prop('communities', jsonSchema.array().items(communitySchema).required())
  .prop('circuits', jsonSchema.array().items(communityCircuitConfigSchema))
  .prop(
    'root-device',
    networkDeviceConfigSchema.description(
      'Root site all other circuits and sites connect to',
    ),
  );
