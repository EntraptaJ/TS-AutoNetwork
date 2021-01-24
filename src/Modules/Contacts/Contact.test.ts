// src/Modules/Contacts/Contact.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { deepStrictEqual } from 'assert';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { ipamConfigController } from '../IPAM/IPAMConfigController';

export class ContactTestSuite extends TestSuite {
  public testName = 'Contact Test Suite';

  public async test(): Promise<void> {
    const ipam = await ipamConfigController.loadFile(
      resolve(
        fileURLToPath(import.meta.url),
        '../fixtures/ContactSample1.yaml',
      ),
    );

    const contact1 = ipam.contacts[0];
    const contact2 = ipam.contacts[1];
    const contact3 = ipam.contacts[2];

    deepStrictEqual(
      contact1.id,
      'lab1.kfj',
      'ipam.contacts[0].id === lab1.kfj',
    );

    deepStrictEqual(
      contact2.id,
      'core1.hello',
      'ipam.contacts[1].id === core1.hello',
    );

    deepStrictEqual(
      contact3.id,
      'net.test',
      'ipam.contacts[2].id === net.test',
    );

    const community1 = ipam.communities[0];
    const community2 = ipam.communities[1];

    deepStrictEqual(
      community1.contactId,
      'lab1.kfj',
      'ipam.communities[0].contactId === lab1.kfj',
    );
    deepStrictEqual(
      community1.contact.id,
      'lab1.kfj',
      'ipam.communities[0].contact.id === lab1.kfj',
    );

    deepStrictEqual(
      community2.contactId,
      'core1.hello',
      'ipam.communities[1].contactId === core1.hello',
    );
    deepStrictEqual(
      community2.contact.id,
      'core1.hello',
      'ipam.communities[1].contact.id === core1.hello',
    );
    deepStrictEqual(
      community2.contact,
      contact2,
      'ipam.communities[1].contact === ipam.contacts[1]',
    );

    const network1 = ipam.networks[0];

    if (network1.networks) {
      const subnetwork1 = network1.networks[0];

      console.log(subnetwork1.prefix, subnetwork1.contact, subnetwork1.circuit);

      deepStrictEqual(subnetwork1.contact?.id, network1.contactId);
    }

    deepStrictEqual(
      network1.contactId,
      'net.test',
      'ipam.networks[0].contactId === net.test',
    );

    deepStrictEqual(
      network1.contact?.id,
      'net.test',
      'ipam.networks[0].contact?.id === net.test',
    );

    deepStrictEqual(
      network1.contact,
      contact3,
      'ipam.networks[0].contact === ipam.contacts[2]',
    );
  }
}
