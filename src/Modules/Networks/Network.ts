// src/Modules/Networks/Network.ts
import Container, { Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { Circuit } from '../Circuits/Circuit';
import { Contact } from '../Contacts/Contact';
import { Network as IPAMNetwork } from '../IPAM/IPAMConfig.gen';
import { NetworkHost } from './NetworkHost';
import { Address4 } from 'ip-address';

@Service()
export class Network implements Omit<IPAMNetwork, 'networks'> {
  /**
   * Network Prefix
   */
  public prefix: string;

  public get IPv4(): Address4 {
    return new Address4(this.prefix);
  }

  /**
   * Friendly description
   */
  public description: string;

  /**
   * Circuit Identifier
   */
  public circuitId?: string;

  public get networks(): Network[] | undefined {
    return Container.getMany(`networks-${this.prefix}`);
  }

  /**
   * Unique Parent Network Id
   */
  public parentNetworkId?: string;

  public get parentNetwork(): Network | undefined {
    if (this.parentNetworkId) {
      return Container.get(
        createContainerName('NETWORK', this.parentNetworkId),
      );
    }
  }

  public get hosts(): NetworkHost[] {
    return Container.getMany(`networkHost-${this.prefix}`);
  }

  /**
   * Contact Object Identifier
   */
  public contactId?: string;

  public free?: boolean;

  public get contact(): Contact | undefined {
    if (this.contactId) {
      return Container.get(createContainerName('CONTACT', this.contactId));
    }

    return this.parentNetwork?.contact;
  }

  /**
   * Circuit Object for this network
   */
  public get circuit(): Circuit | undefined {
    if (this.circuitId) {
      return Container.get(createContainerName('CIRCUIT', this.circuitId));
    }

    return this.parentNetwork?.circuit;
  }

  public constructor(options: Partial<Network>) {
    Object.assign(this, options);
  }
}
