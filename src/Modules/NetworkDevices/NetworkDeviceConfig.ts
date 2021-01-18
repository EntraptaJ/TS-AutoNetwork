// src/Modules/NetworkDevices/NetworkDeviceConfig.ts
import { NetworkDeviceType } from './NetworkDeviceType';

export interface NetworkDeviceConfig {
  name: string;

  community: string;

  type: NetworkDeviceType;
}
