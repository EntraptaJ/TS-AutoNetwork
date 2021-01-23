// src/Modules/NetworkDevices/NetworkDevice.ts
import { Service } from 'typedi';
import {
  Device as IPAMDevice,
  NetworkDeviceType,
} from '../IPAM/IPAMConfig.gen';

@Service()
export class NetworkDevice implements IPAMDevice {
  public id: string;

  public name: string;

  public type: NetworkDeviceType;

  public constructor(options: Partial<NetworkDevice>) {
    Object.assign(this, options);
  }
}
