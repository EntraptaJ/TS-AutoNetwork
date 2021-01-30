// src/Utils/Containers.ts

import Container from 'typedi';
import { Circuit } from '../Modules/Circuits/Circuit';
import { CircuitLocation } from '../Modules/Circuits/CircuitLocation';
import { Community } from '../Modules/Communities/Community';
import { Site } from '../Modules/Sites/Site';
import { Contact } from '../Modules/Contacts/Contact';
import { NetworkDevice } from '../Modules/NetworkDevices/NetworkDevice';
import { Network } from '../Modules/Networks/Network';
import { NetworkHost } from '../Modules/Networks/NetworkHost';

enum ContainerKeys {
  CONTACT = 'contact-',
  COMMUNITY = 'community-',
  SITE_DEVICE = 'networkDevice-',
  SITE = 'communitySite-',
  CIRCUIT_LOCATION = 'circuitLocation-',
  CIRCUIT = 'circuit-',
  NETWORK_HOST = 'networkHost-',
  NETWORK = 'network-',
}

type ValueTypes = {
  CONTACT: Contact;
  COMMUNITY: Community;
  SITE_DEVICE: NetworkDevice;
  SITE: Site;
  CIRCUIT_LOCATION: CircuitLocation;
  CIRCUIT: Circuit;
  NETWORK_HOST: NetworkHost;
  NETWORK: Network;
};

export function createContainerName<
  T extends keyof typeof ContainerKeys,
  S extends string
>(key: T, id: S): `${typeof ContainerKeys[T]}${S}` {
  return `${ContainerKeys[key]}${id}` as const;
}

export function setContainer<T extends keyof typeof ContainerKeys>(
  key: T,
  id: string,
  value: ValueTypes[T],
  container = Container,
): void {
  const containerName = createContainerName(key, id);

  container.set(containerName, value);
  container.set({
    id: key,
    value: id,
    multiple: true,
  });
}

export function getManyContainer<T extends keyof typeof ContainerKeys>(
  key: T,
  container = Container,
): ValueTypes[T][] {
  const valueIds = container.getMany<string>(key);

  return valueIds.map((valueId) =>
    container.get(createContainerName(key, valueId)),
  );
}
