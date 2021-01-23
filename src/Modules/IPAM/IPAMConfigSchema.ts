// src/Modules/Communities/CommunityConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { circuitLocationSchema } from '../CommunityCircuits/CircuitLocationSchema';
import { communityCircuitConfigSchema } from '../CommunityCircuits/CommunityCircuitConfigSchema';
import { communityContactConfigSchema } from '../CommunityContacts/CommunityContactConfigSchema';
import { communitySiteConfigSchema } from '../CommunitySites/CommunitySiteConfigSchema';
import { networkCircuitSchema } from '../Networks/NetworkCircuitSchema';
import { networkSchema } from '../Networks/NetworkSchema';
import { networkDeviceConfigSchema } from '../NetworkDevices/NetworkDeviceConfigSchema';
import { NetworkDeviceInterfaceType } from '../NetworkDevices/NetworkDeviceInterfaceType';
import { networkDeviceLinkSchema } from '../NetworkDevices/NetworkDeviceLinkSchema';
import { NetworkDeviceType } from '../NetworkDevices/NetworkDeviceType';

const communitySchema = jsonSchema
  .object()
  .additionalProperties(false)
  .id('#community')
  .description('Community')
  .prop('contact', jsonSchema.string().description('Community Contact ID'))
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
  .additionalProperties(false)
  .description('IPAM Configuration File')
  .definition('community', communitySchema)
  .definition('contact', communityContactConfigSchema)
  .definition('device', networkDeviceConfigSchema)
  .definition('networkcircuit', networkCircuitSchema)
  .definition('networkDeviceLink', networkDeviceLinkSchema)
  .definition('circuitLocation', circuitLocationSchema)
  .definition('circuit', communityCircuitConfigSchema)
  .definition('network', networkSchema)
  .definition(
    'networkDeviceType',
    jsonSchema.string().enum(Object.values(NetworkDeviceType)),
  )
  .definition(
    'networkDeviceInterfaceType',
    jsonSchema.string().enum(Object.values(NetworkDeviceInterfaceType)),
  )
  .prop(
    'communities',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/community'))
      .required(),
  )
  .prop(
    'circuits',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/circuit'))
      .uniqueItems(true)
      .required()
      .description('Circuits'),
  )
  .prop(
    'circuitLocations',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/circuitLocation'))
      .uniqueItems(true)
      .required()
      .description('External Circuits'),
  )
  .prop(
    'contacts',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/contact'))
      .uniqueItems(true)
      .required()
      .description('Contact Information'),
  )
  .prop(
    'networks',
    jsonSchema
      .array()
      .items(jsonSchema.ref('#/definitions/network'))
      .uniqueItems(true)
      .required()
      .description('Networks'),
  );
