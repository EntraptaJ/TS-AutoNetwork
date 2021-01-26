// src/Modules/Sites/Site.ts
import { Service } from 'typedi';
import { CommunitySite as IPAMCommunitySite } from '../IPAM/IPAMConfig.gen';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';

@Service()
export class Site implements IPAMCommunitySite {
  public id: string;

  public name: string;

  public devices: NetworkDevice[];

  public constructor(options: Partial<Site>) {
    Object.assign(this, options);
  }
}
