// src/Modules/Communities/CommunityConfigController.ts
import { PathLike } from 'fs';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import Container, { Service } from 'typedi';
import { logger, LogMode } from '../../Library/Logger';
import { isObjectType } from '../../Utils/isTypes';
import { Circuit } from '../Circuits/Circuit';
import { CircuitLocation } from '../Circuits/CircuitLocation';
import { CommunitySite } from '../Communities/CommunitySite';
import { Contact } from '../CommunityContacts/CommunityContact';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';
import { Network } from '../Networks/Network';
import { NetworkHost } from '../Networks/NetworkHost';
import { Community } from './Community';
import { IPAM } from './IPAM';
import {
  IPAM as IPAMType,
  Community as IPAMCommunity,
  Contact as IPAMContact,
  CommunitySite as IPAMCommunitySite,
  Device as IPAMDevice,
  Circuit as IPAMCircuit,
  CircuitLocation as IPAMCircuitLocation,
  Network as IPAMNetwork,
  NetworkHost as IPAMNetworkHost,
} from './IPAMConfig.gen';

@Service()
export class IPAMConfigController {
  public processContacts(contacts: IPAMContact[]): Contact[] {
    return contacts.map((contactValues) => {
      const contact = new Contact(contactValues);

      Container.set(`contact-${contact.id}`, contact);

      return contact;
    });
  }

  public processSiteDevices(devices: IPAMDevice[]): NetworkDevice[] {
    return devices.map((deviceValues) => {
      const device = new NetworkDevice(deviceValues);

      Container.set(`networkDevice-${device.id}`, device);

      return device;
    });
  }

  public processSites(sites: IPAMCommunitySite[]): CommunitySite[] {
    return sites.map((communitySiteValues) => {
      const communitySite = new CommunitySite({
        ...communitySiteValues,
        devices:
          typeof communitySiteValues.devices !== 'undefined'
            ? this.processSiteDevices(communitySiteValues.devices)
            : [],
      });

      Container.set(`communitySite-${communitySite.id}`, communitySite);

      return communitySite;
    });
  }

  public processCommunities(communities: IPAMCommunity[]): Community[] {
    return communities.map((communityValue) => {
      const community = new Community({
        contactId: communityValue.contact,
        name: communityValue.name,
        sites: this.processSites(communityValue.sites),
      });

      return community;
    });
  }

  public processCircuitLocations(
    circuitLocations: IPAMCircuitLocation[],
  ): CircuitLocation[] {
    return circuitLocations.map((circuitLocationValues) => {
      const circuitLocation = new CircuitLocation(circuitLocationValues);

      Container.set(`circuitLocation-${circuitLocation.id}`, circuitLocation);

      return circuitLocation;
    });
  }

  public processCircuits(circuits: IPAMCircuit[]): Circuit[] {
    return circuits.map((circuitValues) => {
      const circuit = new Circuit(circuitValues);

      Container.set(`circuit-${circuit.id}`, circuit);

      return circuit;
    });
  }

  public processNetworkHosts(networkHosts: IPAMNetworkHost[]): NetworkHost[] {
    return networkHosts.map((networkHostValue) => {
      const networkHost = new NetworkHost(networkHostValue);

      Container.set(`networkHost-${networkHost.ip}`, networkHost);

      return networkHost;
    });
  }

  public processNetworks(networks: IPAMNetwork[]): Network[] {
    return networks.flatMap(
      ({
        circuit,
        networks: subNetworksValues,
        hosts: hostsValue,
        ...networkValues
      }) => {
        const subNetworks = subNetworksValues
          ? this.processNetworks(subNetworksValues)
          : [];

        const hosts = hostsValue ? this.processNetworkHosts(hostsValue) : [];

        const network = new Network({
          circuitId: circuit?.id,
          networks: subNetworks,
          hosts,
          ...networkValues,
        });

        Container.set(`network-${network.prefix}`, network);

        return [network, ...subNetworks];
      },
    );
  }

  /**
   * Load the configured firewalls configuration file from disk, parse the YAML and load into the class
   */
  public async loadFile(filePath?: PathLike): Promise<void> {
    const ipamConfigFilePath = filePath || 'ipam.yml';

    const ipamFile = await readFile(ipamConfigFilePath);

    const ipamConfigFile = load(ipamFile.toString());

    if (isObjectType<IPAMType>(ipamConfigFile, 'communities')) {
      logger.log(
        LogMode.INFO,
        'Loaded Communities Configuration File',
        ipamConfigFilePath,
      );

      logger.log(LogMode.DEBUG, `IPAMConfig: `, ipamConfigFile);

      const contacts = this.processContacts(ipamConfigFile.contacts);
      const communities = this.processCommunities(ipamConfigFile.communities);

      const circuitLocations = this.processCircuitLocations(
        ipamConfigFile.circuitLocations,
      );

      const circuits = this.processCircuits(ipamConfigFile.circuits);
      const networks = this.processNetworks(ipamConfigFile.networks);

      const ipam = new IPAM({
        circuitLocations,
        circuits,
        communities,
        contacts,
        networks,
      });

      for (const network of ipam.networks) {
        network.hosts.map((networkHost) => console.log(networkHost.coreDevice));
      }

      return;
    }

    throw new Error('Invlaid Firewalls configuration file');
  }
}

export const ipamConfigController = new IPAMConfigController();
