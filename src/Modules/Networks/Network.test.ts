// src/Modules/Networks/Network.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { IPAMController } from '../IPAM/IPAMController';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { deepStrictEqual } from 'assert';
import { Address4 } from 'ip-address';

export class NetworkTestSuite extends TestSuite {
  public testName = 'Network Test Suite';

  public async test(): Promise<void> {
    const ipamController = IPAMController.createIPAM();

    const networkFixturePath = resolve(
      fileURLToPath(import.meta.url),
      '../fixtures/Networks.yaml',
    );

    console.log(`networkFixturePath: `, networkFixturePath);

    const config = await ipamController.loadIPAM(networkFixturePath);

    const networkCore = config.networks.find(
      ({ prefix }) => prefix === '1.0.0.0/30',
    );

    deepStrictEqual(
      networkCore?.prefix,
      '1.0.0.0/30',
      'networkCore?.prefix === 1.0.0.0/30',
    );
    deepStrictEqual(
      networkCore?.description,
      'Toronto Cabniet P2P',
      'networkCore?.description === Toronto Cabniet P2P',
    );

    /**
     * networkCore?.hosts[0]
     */
    deepStrictEqual(
      networkCore?.hosts[0]?.ip,
      '1.0.0.1',
      'networkCore?.hosts[0]?.ip === 1.0.0.1',
    );
    deepStrictEqual(
      networkCore?.hosts[0]?.description,
      'Toronto Cabniet 1',
      'networkCore?.hosts[0]?.description === Toronto Cabniet 1',
    );
    deepStrictEqual(
      networkCore?.hosts[0]?.contactId,
      'tor.todo1',
      'networkCore?.hosts[0]?.contactId === tor.todo1',
    );
    deepStrictEqual(
      networkCore?.hosts[0]?.deviceId,
      'tor.c1.rt1',
      'networkCore?.hosts[0]?.deviceId === tor.c1.rt1',
    );
    deepStrictEqual(
      networkCore?.hosts[0]?.deviceInterface,
      'TenGigE0/0/0/1',
      'networkCore?.hosts[0]?.deviceInterface === TenGigE0/0/0/1',
    );

    /**
     * networkCore?.hosts[1]
     */
    deepStrictEqual(
      networkCore?.hosts[1]?.ip,
      '1.0.0.2',
      'networkCore?.hosts[1]?.ip === 1.0.0.2',
    );
    deepStrictEqual(
      networkCore?.hosts[1]?.description,
      'Toronto Cabniet 2',
      'networkCore?.hosts[1]?.description === Toronto Cabniet 2',
    );
    deepStrictEqual(
      networkCore?.hosts[1]?.contactId,
      undefined,
      'networkCore?.hosts[1]?.contactId === undefined',
    );

    deepStrictEqual(
      networkCore?.hosts[1]?.deviceId,
      'tor.c2.rt1',
      'networkCore?.hosts[1]?.deviceId === tor.c2.rt1',
    );
    deepStrictEqual(
      networkCore?.hosts[1]?.deviceInterface,
      'TenGigE0/0/0/2',
      'networkCore?.hosts[1]?.deviceInterface === TenGigE0/0/0/2',
    );

    /**
     * networkCore?.IPv4
     */

    const IPv4 = networkCore?.IPv4;
    const localIPv4 = new Address4('1.0.0.0/30');

    deepStrictEqual(
      IPv4.address,
      localIPv4.address,
      `networkCore?.IPv4.address === new Address4('1.0.0.0/30').address`,
    );

    deepStrictEqual(
      IPv4.addressMinusSuffix,
      localIPv4.addressMinusSuffix,
      `networkCore?.IPv4.addressMinusSuffix === new Address4('1.0.0.0/30').addressMinusSuffix`,
    );

    deepStrictEqual(
      IPv4.subnet,
      localIPv4.subnet,
      `networkCore?.IPv4.subnet === new Address4('1.0.0.0/30').subnet`,
    );

    deepStrictEqual(
      IPv4.subnetMask,
      localIPv4.subnetMask,
      `networkCore?.IPv4.subnetMask === new Address4('1.0.0.0/30').subnetMask`,
    );
  }
}
