// src/index.ts
import 'reflect-metadata';
import { timeout } from './Utils/timeout';
import { logger, LogMode } from './Library/Logger';
import { ipamConfigController } from './Modules/IPAM/IPAMConfigController';
import Container from 'typedi';
import { NetworkController } from './Modules/Networks/NetworkController';
import { Address4 } from 'ip-address';
import { getSmallestSubnet } from './Utils/Networks';

const ipam = await ipamConfigController.loadFile('IPAM.yaml');
console.log(ipam);

const networkController = Container.get(NetworkController);

const ddosIP = new Address4('66.165.222.177/32');
const networks = networkController.findIP(ddosIP);

const device = getSmallestSubnet(networks);
console.log(device.contact);

/* const community = ipam.communities.find(({ name }) => name === 'Toronto');

if (community?.sites) {
  console.log(community.contact);

  for (const site of community.sites) {
    console.log(site);

    for (const siteDevice of site.devices) {
      console.log(siteDevice);
    }
  }
} */

/* if (device) {
  for (const deviceInterface of device.interfaces) {
    console.log(
      `Interface ${deviceInterface?.interface}`,
      deviceInterface?.ip.address,
    );
  }
} */

/* 
if (device) {
  const deviceHosts = device.getDeviceHosts();

  for (const deviceHost of deviceHosts) {
    for (const networkHost of deviceHost.parentNetwork.hosts) {
      if (networkHost?.device?.id === device.id) {
        continue;
      }

      console.log(networkHost.coreDevice?.interfaces);
    }
  }
}
 */
/* interface Country {
  name: string;
}

interface ValidData<T extends Country> {
  countries: T[];

  country?: T['name'];
}

const schema: JSONSchemaType<ValidData<Country>> = {
  type: 'object',
  $id: 'countries',
  properties: {
    values: {},
    value: {
      enum: {
        $data: '/values/#name',
      },
    },
  },
  required: ['countries'],
};

const validData: ValidData<Country> = {
  countries: [
    {
      name: 'Hello',
    },
  ],
  country: 'Hello',
};

const ajv = new Ajv({
  $data: true,
  validateSchema: true,
  validateFormats: true,
});

const validate = ajv.compile(schema);

console.log(validate(validData)); */

/* const jsonSchema = ajv.getSchema('countries')?.schema;
if (typeof jsonSchema !== 'undefined' && typeof jsonSchema !== 'boolean') {
  if ('$schema' in jsonSchema) {
    const schemaFileJSON = JSON.stringify(jsonSchema);

    console.log(schemaFileJSON);
  }
} */

/**
 * Logs a greeting for the name after a 1.5 second delay.
 * @param name User you are greeting
 */
async function sayHello(name = 'John'): Promise<void> {
  logger.log(LogMode.INFO, 'Waiting 1.5 seconds then saying Hi');

  await timeout(1500);

  logger.log(LogMode.INFO, `Hello ${name}!`);
}

logger.log(LogMode.INFO, `Starting TS-Core`);

await sayHello('K-FOSS');

export {};
