// src/Modules/IPAM/IPAM.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { deepStrictEqual, rejects } from 'assert';
import { resolve } from 'path';
import Container from 'typedi';
import { fileURLToPath } from 'url';
import { IPAMController } from './IPAMController';

export class IPAMSuite extends TestSuite {
  public testName = 'IPAM Test Suite';

  public async test(): Promise<void> {
    const ipamValidContainer1 = Container.of('IPAMValid1');

    const ipamValidController = IPAMController.createIPAM({
      container: ipamValidContainer1,
    });

    const ipamValidFixture1Path = resolve(
      fileURLToPath(import.meta.url),
      '../fixtures/ValidFile1.yaml',
    );

    console.log('Loading?');

    /**
     * Valid Config 1
     *
     * 1 Root Network
     * 1 Child Network
     *
     * 1 Contact
     *
     * 2 Circuit Locations
     *
     * 1 Circuit
     *
     * 1 Community
     * 2 Sites under Community
     */
    const validConfig1 = await ipamValidController.loadIPAM(
      ipamValidFixture1Path,
    );

    deepStrictEqual(
      typeof validConfig1 === 'undefined',
      false,
      'typeof validConfig1 === undefined === false',
    );

    deepStrictEqual(
      validConfig1.networks.length,
      2,
      `validConfig1.networks.length === 2`,
    );

    /**
     * Invalid YAML #1 - Single Invalid Device ID
     */
    const ipamInvalidFixture1Path = resolve(
      fileURLToPath(import.meta.url),
      '../fixtures/InvalidFile1.yaml',
    );

    const ipamInvalidContainer1 = Container.of('IPAMInvalid1');
    const invalidIPAMController1 = IPAMController.createIPAM({
      container: ipamInvalidContainer1,
    });

    await rejects(
      invalidIPAMController1.loadIPAM(ipamInvalidFixture1Path),
      [
        `${ipamInvalidFixture1Path}: line 50, Error - Sitedevice with ID (tor.c1.rt0) does not exist! (validId)`,
      ],
      'Invalid Device ID Throws',
    );

    Container.reset();

    /**
     * Invalid YAML #2 - Single Invalid Device ID
     */
    const ipamInvalidFixture2Path = resolve(
      fileURLToPath(import.meta.url),
      '../fixtures/InvalidFile2.yaml',
    );

    console.log(ipamInvalidFixture2Path);

    const ipamInvalidContainer2 = Container.of('IPAMInvalid2');
    const invalidIPAMController2 = IPAMController.createIPAM({
      container: ipamInvalidContainer2,
    });

    await rejects(
      invalidIPAMController2.loadIPAM(ipamInvalidFixture2Path),
      [
        '/workspace/src/Modules/IPAM/fixtures/InvalidFile2.yaml: line 50, Error - Sitedevice with ID (tor.c1.rt0) does not exist! (validId)',
        '/workspace/src/Modules/IPAM/fixtures/InvalidFile2.yaml: line 54, Error - Sitedevice with ID (tor.c2.rt4) does not exist! (validId)',
      ],
      'Invalid Device ID Throws',
    );
  }
}
