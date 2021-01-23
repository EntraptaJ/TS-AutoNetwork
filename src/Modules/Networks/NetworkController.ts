// src/Modules/Networks/NetworkController.ts
import { Inject, Service } from 'typedi';
import { Network } from './Network';
import { Address4 } from 'ip-address';

@Service()
export class NetworkController {
  @Inject('networks')
  public networks: Network[];

  public findIP(ipAddress: Address4): Network[] {
    return this.networks.filter((network) =>
      ipAddress.isInSubnet(network.IPv4),
    );
  }
}
