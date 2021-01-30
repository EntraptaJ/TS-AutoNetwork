// src/Utils/Types.ts
import { Circuit } from '../Modules/Circuits/Circuit';
import { CircuitLocation } from '../Modules/Circuits/CircuitLocation';
import { Community } from '../Modules/Communities/Community';
import { Site } from '../Modules/Sites/Site';
import { Contact } from '../Modules/Contacts/Contact';
import { SiteDevice } from '../Modules/SiteDevice/SiteDevice';
import { Network } from '../Modules/Networks/Network';
import { NetworkHost } from '../Modules/Networks/NetworkHost';

export enum ContainerKeys {
  CONTACT = 'contact-',
  COMMUNITY = 'community-',
  SITEDEVICE = 'networkDevice-',
  SITE = 'communitySite-',
  CIRCUITLOCATION = 'circuitLocation-',
  CIRCUIT = 'circuit-',
  NETWORKHOST = 'networkHost-',
  NETWORK = 'network-',
}

export enum TypeIDField {
  CONTACT = 'id',
  COMMUNITY = 'id',
  SITEDEVICE = 'id',
  SITE = 'id',
  CIRCUITLOCATION = 'id',
  CIRCUIT = 'id',
  NETWORKHOST = 'ip',
  NETWORK = 'prefix',
}

export type ValueTypes = {
  CONTACT: Contact;
  COMMUNITY: Community;
  SITEDEVICE: SiteDevice;
  SITE: Site;
  CIRCUITLOCATION: CircuitLocation;
  CIRCUIT: Circuit;
  NETWORKHOST: NetworkHost;
  NETWORK: Network;
};

export function isContainerKey<T extends keyof typeof ContainerKeys>(
  key: T,
): boolean {
  return Object.keys(ContainerKeys).includes(key);
}
