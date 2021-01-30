// src/Modules/NetworkDevices/NetworkDevice.ts
import { Service } from 'typedi';
import { Device as IPAMDevice } from '../IPAM/IPAMConfig.gen';
import { NetworkHost } from '../Networks/NetworkHost';
import { NetworkDeviceInterface } from './NetworkDeviceInterface';
import { Address4 } from 'ip-address';
import { JSONSchema } from 'class-validator-jsonschema';
import { NetworkDeviceType } from './NetworkDeviceType';
import { IsOptional, IsString } from 'class-validator';
import { getManyContainer } from '../../Utils/Containers';

@JSONSchema({
  title: 'NetworkDevice',
})
@Service()
export class NetworkDevice implements IPAMDevice {
  @IsString()
  @JSONSchema({
    description:
      'Unique Network Device ID used for refences from other objects',
  })
  public id: string;

  @IsString()
  @JSONSchema({
    description: 'Friendly name for this device',
  })
  public name: string;

  /**
   * Network Device Type
   */

  @IsOptional()
  @IsString()
  @JSONSchema({
    enum: Object.values(NetworkDeviceType),
    description:
      'Type of the device, used for tracing, and for reverse dns creation',
  })
  public type: NetworkDeviceType;

  /**
   * TODO: Clean this up
   */

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
      const networkHosts = getManyContainer('NETWORK_HOST');

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
}
