// src/Modules/Networks/NetworkController.ts
import { Address4 } from 'ip-address';
import Container, { Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { Network } from './Network';

@Service()
export class NetworkController {
  public get networks(): Network[] {
    const networkIds = Container.getMany<string>('network');

    return networkIds.map((networkId) =>
      Container.get(createContainerName('NETWORK', networkId)),
    );
  }

  public findIP(ipAddress: Address4): Network[] {
    return this.networks.filter((network) =>
      ipAddress.isInSubnet(network.IPv4),
    );
  }
}
