// src/Modules/NetworkDevices/NetworkDevice.ts
import Container, { Service } from 'typedi';
import {
  Device as IPAMDevice,
  NetworkDeviceType,
} from '../IPAM/IPAMConfig.gen';
import { NetworkHost } from '../Networks/NetworkHost';

@Service()
export class NetworkDevice implements IPAMDevice {
  public id: string;

  public name: string;

  public type: NetworkDeviceType;

  private deviceHosts: NetworkHost[];

  public getDeviceHosts(): NetworkHost[] {
    if (!this.deviceHosts) {
      const deviceHosts = Container.getMany<NetworkHost>('NETWORK_HOST');
      this.deviceHosts = deviceHosts.filter(
        (deviceHost) => deviceHost.device?.id === this.id,
      );
    }

    return this.deviceHosts;
  }

  public getAllIPs(): string[] {
    return this.getDeviceHosts()
      .map(({ device, ip }) => (device?.id === this.id ? ip : undefined))
      .filter(Boolean) as string[];
  }

  public constructor(options: Partial<NetworkDevice>) {
    Object.assign(this, options);
  }
}
