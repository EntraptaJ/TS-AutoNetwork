// src/Modules/Communities/CommunityConfigController.ts
import { PathLike } from 'fs';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import Container, { Service } from 'typedi';
import { logger, LogMode } from '../../Library/Logger';
import { setContainer } from '../../Utils/Containers';
import { isObjectType } from '../../Utils/isTypes';
import { Circuit } from '../Circuits/Circuit';
import { CircuitLocation } from '../Circuits/CircuitLocation';
import { CommunitySite } from '../Communities/CommunitySite';
import { Contact } from '../Contacts/Contact';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';
import { Network } from '../Networks/Network';
import { NetworkHost } from '../Networks/NetworkHost';
import { Community } from '../Communities/Community';
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

      setContainer('CONTACT', contact.id, contact);

      return contact;
    });
  }

  public processSiteDevices(devices: IPAMDevice[]): NetworkDevice[] {
    return devices.map((deviceValues) => {
      const device = new NetworkDevice(deviceValues);

      setContainer('SITE_DEVICE', device.id, device);

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

      setContainer('SITE', communitySite.id, communitySite);

      return communitySite;
    });
  }

  public processCommunities(communities: IPAMCommunity[]): Community[] {
    return communities.map(
      ({ sites, contact: contactId, ...communityValues }) => {
        const community = new Community({
          ...communityValues,
          contactId,
          sites: this.processSites(sites),
        });

        return community;
      },
    );
  }

  public processCircuitLocations(
    circuitLocations: IPAMCircuitLocation[],
  ): CircuitLocation[] {
    return circuitLocations.map((circuitLocationValues) => {
      const circuitLocation = new CircuitLocation(circuitLocationValues);

      setContainer('CIRCUIT_LOCATION', circuitLocation.id, circuitLocation);

      return circuitLocation;
    });
  }

  public processCircuits(circuits: IPAMCircuit[]): Circuit[] {
    return circuits.map((circuitValues) => {
      const circuit = new Circuit(circuitValues);

      setContainer('CIRCUIT', circuit.id, circuit);

      return circuit;
    });
  }

  public processNetworkHosts(
    networkHosts: IPAMNetworkHost[],
    parentNetwork: Network,
  ): NetworkHost[] {
    return networkHosts.map((networkHostValue) => {
      const networkHost = new NetworkHost({
        ...networkHostValue,
        parentNetworkId: parentNetwork.prefix,
      });

      Container.set({
        id: `networkHost-${parentNetwork.prefix}`,
        multiple: true,
        value: networkHost,
      });

      setContainer('NETWORK_HOST', networkHost.ip, networkHost);

      return networkHost;
    });
  }

  public processNetworks(
    networks: IPAMNetwork[],
    parentNetwork?: Network,
  ): Network[] {
    return networks.flatMap(
      ({
        circuit,
        networks: subNetworksValues,
        hosts: hostsValue,
        ...networkValues
      }) => {
        const network = new Network({
          circuitId: circuit?.id,
          parentNetworkId: parentNetwork?.prefix,
          ...networkValues,
        });

        const subNetworks = subNetworksValues
          ? this.processNetworks(subNetworksValues, network)
          : [];

        if (parentNetwork) {
          Container.set({
            id: `networks-${parentNetwork.prefix}`,
            multiple: true,
            value: network,
          });
        }

        const hosts = hostsValue
          ? this.processNetworkHosts(hostsValue, network)
          : [];
        logger.log(LogMode.DEBUG, 'hosts', hosts);

        setContainer('NETWORK', network.prefix, network);

        return [network, ...subNetworks];
      },
    );
  }

  /**
   * Load the configured firewalls configuration file from disk, parse the YAML and load into the class
   */
  public async loadFile(filePath?: PathLike): Promise<IPAM> {
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

      Container.set('networks', networks);

      return new IPAM({
        circuitLocations,
        circuits,
        communities,
        contacts,
        networks,
      });
    }

    throw new Error('Invalid IPAM configuration file');
  }
}

export const ipamConfigController = new IPAMConfigController();
