// src/Modules/Contacts/Contact.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { deepStrictEqual } from 'assert';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { IPAMController } from '../IPAM/IPAMController';

export class ContactSuite extends TestSuite {
  public testName = 'Contact Test Suite';

  public async test(): Promise<void> {
    const ipamController = IPAMController.createIPAM();

    const contactFixture1Path = resolve(
      fileURLToPath(import.meta.url),
      '../fixtures/ContactSample1.yaml',
    );

    const config = await ipamController.loadIPAM(contactFixture1Path);

    /**
     * Contacts
     */

    /**
     * Contact 1 - Kristian Jones
     */
    const kristianjones1 = config.contacts.find(
      (contact) => contact.name === 'Kristian Jones',
    );

    deepStrictEqual(
      kristianjones1?.id,
      'lab1.kfj',
      'kristianjones1.id === lab1.kfj',
    );
    deepStrictEqual(
      kristianjones1?.name,
      'Kristian Jones',
      'kristianjones1.name === Kristian Jones',
    );

    /**
     * Contact 2 - Hello World
     */
    const helloworld1 = config.contacts.find(
      (contact) => contact.name === 'Hello World',
    );

    deepStrictEqual(
      helloworld1?.id,
      'core1.hello',
      'helloworld1.id === core1.hello',
    );
    deepStrictEqual(
      helloworld1?.name,
      'Hello World',
      'helloworld1.name === Hello World',
    );

    /**
     * Contact 3 - HelloTest
     */
    const hellotest1 = config.contacts.find(
      (contact) => contact.name === 'HelloTest',
    );

    deepStrictEqual(hellotest1?.id, 'net.test', 'hellotest1.id === net.test');
    deepStrictEqual(
      hellotest1?.name,
      'HelloTest',
      'hellotest1.name === HelloTest',
    );

    /**
     * Contact 4 - Third Party Provider
     */
    const thirdPartyProvider1 = config.contacts.find(
      (contact) => contact.id === 'thirdparty.core',
    );

    deepStrictEqual(
      thirdPartyProvider1?.id,
      'thirdparty.core',
      'thirdPartyProvider1?.id === thirdparty.core',
    );
    deepStrictEqual(
      thirdPartyProvider1?.name,
      'Third Party Provider 1',
      'thirdPartyProvider1?.name === Third Party Provider 1',
    );

    /**
     * Networks 1 - HelloTest
     */
    const coreNetwork = config.networks.find(
      (network) => network.prefix === '1.1.1.0/24',
    );

    deepStrictEqual(
      coreNetwork?.contactId,
      hellotest1.id,
      'coreNetwork?.contactId === hellotest1.id',
    );
    deepStrictEqual(
      coreNetwork?.contact,
      hellotest1,
      'coreNetwork?.contact === hellotest1',
    );

    /**
     * Network 1 - Sub Network 1 - External Provider
     */
    const coreNetworkSub1 = coreNetwork.networks.find(
      (network) => network.prefix === '1.1.1.0/30',
    );

    deepStrictEqual(
      coreNetworkSub1?.prefix,
      '1.1.1.0/30',
      'coreNetworkSub1?.prefix === 1.1.1.0/30',
    );
  }
}
