// src/Modules/Networks/Network.ts
import Container, { Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { Circuit } from '../Circuits/Circuit';
import { Contact } from '../CommunityContacts/CommunityContact';
import { Network as IPAMNetwork } from '../IPAM/IPAMConfig.gen';
import { NetworkHost } from './NetworkHost';
import { Address4 } from 'ip-address';

@Service()
export class Network implements IPAMNetwork {
  public prefix: string;

  public get IPv4(): Address4 {
    return new Address4(this.prefix);
  }

  public description: string;

  public circuitId?: string;

  public networks?: Network[];

  public hosts: NetworkHost[];

  public contactId?: string;

  public get contact(): Contact | undefined {
    if (this.contactId) {
      return Container.get(createContainerName('CONTACT', this.contactId));
    }
  }

  public get circuit(): Circuit | undefined {
    if (!this.circuitId) {
      return undefined;
    }

    return Container.get(createContainerName('CIRCUIT', this.circuitId));
  }

  public constructor(options: Partial<Network>) {
    Object.assign(this, options);
  }
}
