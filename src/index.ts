// src/index.ts
import 'reflect-metadata';
import { timeout } from './Utils/timeout';
import { logger, LogMode } from './Library/Logger';
import Container from 'typedi';
import { IPAMController } from './Modules/IPAM/IPAMController';

const ipamController = Container.get(IPAMController);

const config = await ipamController.loadIPAM('IPAM.yaml');

const toronto = config.communities.find(({ name }) => name === 'Toronto');

console.log(toronto);

console.log(config.contacts);

// await ipamController.saveSchema();

/*
import { ipamConfigController } from './Modules/IPAM/IPAMConfigController';
import Container, { Service } from 'typedi';
import { NetworkController } from './Modules/Networks/NetworkController';
import { Address4 } from 'ip-address';
import { getSmallestSubnet } from './Utils/Networks';
import { CircuitController } from './Modules/Circuits/CircuitController';

const ipam = await ipamConfigController.loadFile('IPAM.yaml');
Container.set('ipam', ipam);

/* const communityCount = ipam.communities.length;
const totalCommunity = 80;

console.log(
  `Currently have ${communityCount} communities entered out of ${totalCommunity}, ${
    totalCommunity - communityCount
  } remaining `,
);

Container.set('totalCommunities', 80);
Container.set('rootSiteId', 'tor.c74');
Container.set('rootDeviceId', 'tor.c74.rt1');

const circuitController = Container.get(CircuitController);

circuitController.listCircuits();

const networkController = Container.get(NetworkController);

const ddosIP = new Address4('66.165.192.189/32');
const networks = networkController.findIP(ddosIP);

const device = getSmallestSubnet(networks);

for (const service of Container.globalInstance.services as Service[]) {
  console.log(service);
}

console.log(); */

/* if (device.circuit?.speed) {
  for (const network of device.circuit.networks) {
    for (const host of network.hosts) {
      console.log(
        `${host.device?.interface} runs at ${device.circuit.sideA.id}`,
      );
    }
  }
} */

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
