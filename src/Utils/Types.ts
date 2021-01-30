// src/Utils/Types.ts
import { Circuit } from '../Modules/Circuits/Circuit';
import { CircuitLocation } from '../Modules/Circuits/CircuitLocation';
import { Community } from '../Modules/Communities/Community';
import { Site } from '../Modules/Sites/Site';
import { Contact } from '../Modules/Contacts/Contact';
import { NetworkDevice } from '../Modules/NetworkDevices/NetworkDevice';
import { Network } from '../Modules/Networks/Network';
import { NetworkHost } from '../Modules/Networks/NetworkHost';

export enum ContainerKeys {
  CONTACT = 'contact-',
  COMMUNITY = 'community-',
  SITE_DEVICE = 'networkDevice-',
  SITE = 'communitySite-',
  CIRCUIT_LOCATION = 'circuitLocation-',
  CIRCUIT = 'circuit-',
  NETWORK_HOST = 'networkHost-',
  NETWORK = 'network-',
}

export enum TypeIDField {
  CONTACT = 'id',
  COMMUNITY = 'id',
  SITE_DEVICE = 'id',
  SITE = 'id',
  CIRCUIT_LOCATION = 'id',
  CIRCUIT = 'id',
  NETWORK_HOST = 'ip',
  NETWORK = 'prefix',
}

export type ValueTypes = {
  CONTACT: Contact;
  COMMUNITY: Community;
  SITE_DEVICE: NetworkDevice;
  SITE: Site;
  CIRCUIT_LOCATION: CircuitLocation;
  CIRCUIT: Circuit;
  NETWORK_HOST: NetworkHost;
  NETWORK: Network;
};
