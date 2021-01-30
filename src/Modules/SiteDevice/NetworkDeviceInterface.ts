// src/Modules/NetworkDevices/NetworkDeviceInterface.ts
import { Address4 } from 'ip-address';

export class NetworkDeviceInterface {
  public ip: Address4;

  public interface: string;

  public constructor(options: Partial<NetworkDeviceInterface>) {
    Object.assign(this, options);
  }
}
