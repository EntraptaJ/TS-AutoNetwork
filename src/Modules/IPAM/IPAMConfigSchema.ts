// src/Modules/Communities/CommunityConfigSchema.ts
import jsonSchema from 'fluent-json-schema';
import { circuitLocationSchema } from '../CommunityCircuits/CircuitLocationSchema';
import { circuitSchema } from '../Circuits/CircuitSchema';
import { communityContactConfigSchema } from '../CommunityContacts/CommunityContactConfigSchema';
import { communitySiteSchema } from '../Communities/CommunitySiteSchema';
import { networkCircuitSchema } from '../Networks/NetworkCircuitSchema';
import { networkSchema } from '../Networks/NetworkSchema';
import { networkDeviceConfigSchema } from '../NetworkDevices/NetworkDeviceConfigSchema';
import { NetworkDeviceInterfaceType } from '../NetworkDevices/NetworkDeviceInterfaceType';
import { networkDeviceLinkSchema } from '../NetworkDevices/NetworkDeviceLinkSchema';
import { NetworkDeviceType } from '../NetworkDevices/NetworkDeviceType';
import { communitySchema } from '../Communities/CommunitySchema';
import { circuitSideSchema } from '../Circuits/CircuitSideSchema';
import { networkHostSchema } from '../Networks/NetworkHostSchema';
import { networkRangeSchema } from '../Networks/NetworkRangeSchema';

export const communityConfigSchema = jsonSchema
  .object()
  .additionalProperties(false)
  .description('IPAM Configuration File')
  .definition('community', communitySchema)
  .definition('communitySite', communitySiteSchema)
  .definition('contact', communityContactConfigSchema)
  .definition('device', networkDeviceConfigSchema)
  .definition('networkcircuit', networkCircuitSchema)
  .definition('networkDeviceLink', networkDeviceLinkSchema)
  .definition('circuitLocation', circuitLocationSchema)
  .definition('circuit', circuitSchema)
  .definition('circuitSide', circuitSideSchema)
  .definition('network', networkSchema)
  .definition('networkHost', networkHostSchema)
  .definition('networkRange', networkRangeSchema)
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
