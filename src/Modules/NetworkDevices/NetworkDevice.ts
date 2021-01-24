// src/Modules/NetworkDevices/NetworkDevice.ts
import Container, { Service } from 'typedi';
import {
  Device as IPAMDevice,
  NetworkDeviceType,
} from '../IPAM/IPAMConfig.gen';
import { NetworkHost } from '../Networks/NetworkHost';
import { NetworkDeviceInterface } from './NetworkDeviceInterface';
import { Address4 } from 'ip-address';

@Service()
export class NetworkDevice implements IPAMDevice {
  /**
   * Unique Device Id for usage in YAML references
   */
  public id: string;

  /**
   * Friendly name
   */
  public name: string;

  /**
   * Network Device Type
   */
  public type: NetworkDeviceType;

  private networkHosts: NetworkHost[];

  /**
   * All Network Device Interfaces for this device
   */
  public get interfaces(): NetworkDeviceInterface[] {
    const networkHosts = this.getNetworkHosts();

    return networkHosts
      .map(({ ip, device }) =>
        device && device.interface
          ? new NetworkDeviceInterface({
              interface: device.interface,
              ip: new Address4(ip),
            })
          : undefined,
      )
      .filter(Boolean) as NetworkDeviceInterface[];
  }

  public getNetworkHosts(): NetworkHost[] {
    if (!this.networkHosts) {
      const networkHosts = Container.getMany<NetworkHost>('NETWORK_HOST');

      this.networkHosts = networkHosts.filter(
        (networkHost) => networkHost.device?.id === this.id,
      );
    }

    return this.networkHosts;
  }

  /**
   * Get all IP addresses for this device
   */
  public getAllIPs(): string[] {
    return this.getNetworkHosts()
      .map(({ device, ip }) => (device?.id === this.id ? ip : undefined))
      .filter(Boolean) as string[];
  }

  public constructor(options: Partial<NetworkDevice>) {
    Object.assign(this, options);
  }
}
