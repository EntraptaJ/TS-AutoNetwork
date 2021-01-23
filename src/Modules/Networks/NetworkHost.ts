// src/Modules/Networks/NetworkHost.ts
import Container, { Service } from 'typedi';
import {
  NetworkDeviceLink,
  NetworkHost as IPAMNetworkHost,
} from '../IPAM/IPAMConfig.gen';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';

@Service()
export class NetworkHost implements IPAMNetworkHost {
  public ip: string;

  public description: string;

  public device?: NetworkDeviceLink;

  public get coreDevice(): NetworkDevice | undefined {
    if (this.device?.id) {
      return Container.get(`networkDevice-${this.device.id}`);
    }
  }

  public constructor(options: Partial<NetworkHost>) {
    Object.assign(this, options);
  }
}
