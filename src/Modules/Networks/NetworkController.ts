// src/Modules/Networks/NetworkController.ts
import { Address4 } from 'ip-address';
import { Inject, Service } from 'typedi';
import { Context, contextToken } from '../../Library/Context';
import { createContainerName } from '../../Utils/Containers';
import { Network } from './Network';

@Service()
export class NetworkController {
  @Inject(contextToken)
  public context: Context;

  public get networks(): Network[] {
    const networkIds = this.context.container.getMany<string>('network');

    return networkIds.map((networkId) =>
      this.context.container.get(createContainerName('NETWORK', networkId)),
    );
  }

  public findIP(ipAddress: Address4): Network[] {
    return this.networks.filter((network) =>
      ipAddress.isInSubnet(network.IPv4),
    );
  }
}
