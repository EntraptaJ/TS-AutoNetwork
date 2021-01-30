// src/Modules/Circuits/CircuitController.ts
import Container, { Inject, Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { IPAM } from '../IPAM/IPAM';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';
import { Site } from '../Sites/Site';

@Service()
export class CircuitController {
  @Inject('ipam')
  public ipam: IPAM;

  public get communityCount(): number {
    return this.ipam.communities.length;
  }

  public rootDevice: NetworkDevice;

  public rootSite: Site;

  public constructor(
    @Inject('totalCommunities')
    public totalCommunities: number,
    @Inject('rootSiteId') public rootSiteId: string,
    @Inject('rootDeviceId')
    public rootDeviceId: string,
  ) {
    this.rootSite = Container.get(createContainerName('SITE', this.rootSiteId));

    this.rootDevice = Container.get(
      createContainerName('SITE_DEVICE', this.rootDeviceId),
    );
  }

  public listCircuits(): void {
    for (const networkHost of this.rootDevice.getNetworkHosts()) {
      const circuit = networkHost.parentNetwork.circuit;

      if (networkHost.device?.interface && circuit?.id) {
        console.log(
          `${
            networkHost.device.interface
          } circuit run at ${circuit
            .parsedCircuitSpeed()
            .convertTo('Mb')} for community: ${
            circuit.sideACircuitLocation.communuity.name
          }`,
        );
      } else {
        console.log(`No device Interface or circuit`, networkHost);
      }
    }
  }
}
