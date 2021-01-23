// src/Modules/Communities/CommunitySite.ts
import { Inject, InjectMany, Service } from 'typedi';
import { CommunitySite as IPAMCommunitySite } from '../IPAM/IPAMConfig.gen';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';

@Service()
export class CommunitySite implements IPAMCommunitySite {
  public id: string;

  public name: string;

  public devices: NetworkDevice[];

  public constructor(options: Partial<CommunitySite>) {
    Object.assign(this, options);
  }
}
