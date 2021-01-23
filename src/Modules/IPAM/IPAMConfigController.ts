// src/Modules/Communities/CommunityConfigController.ts
import { PathLike } from 'fs';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import Container, { Service } from 'typedi';
import { logger, LogMode } from '../../Library/Logger';
import { isObjectType } from '../../Utils/isTypes';
import { CommunitySite } from '../Communities/CommunitySite';
import { Contact } from '../CommunityContacts/CommunityContact';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';
import { Community } from './Community';
import {
  IPAM,
  Community as IPAMCommunity,
  Contact as IPAMContact,
  CommunitySite as IPAMCommunitySite,
  Device as IPAMDevice,
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

  /**
   * Load the configured firewalls configuration file from disk, parse the YAML and load into the class
   */
  public async loadFile(filePath?: PathLike): Promise<void> {
    const ipamConfigFilePath = filePath || 'ipam.yml';

    const ipamFile = await readFile(ipamConfigFilePath);

    const ipamConfigFile = load(ipamFile.toString());

    if (isObjectType<IPAM>(ipamConfigFile, 'communities')) {
      logger.log(
        LogMode.INFO,
        'Loaded Communities Configuration File',
        ipamConfigFilePath,
      );

      logger.log(LogMode.DEBUG, `IPAMConfig: `, ipamConfigFile);

      const contacts = this.processContacts(ipamConfigFile.contacts);
      const communities = this.processCommunities(ipamConfigFile.communities);

      const torontoCommunity = communities.find(
        ({ name }) => name === 'Toronto',
      );

      if (torontoCommunity) {
        const device = torontoCommunity.sites[0].devices[0];

        logger.log(
          LogMode.DEBUG,
          'Toronto: ',
          device,
          Container.get(`networkDevice-${device.id}`),
        );
      }

      return;
    }

    throw new Error('Invlaid Firewalls configuration file');
  }
}

export const ipamConfigController = new IPAMConfigController();
