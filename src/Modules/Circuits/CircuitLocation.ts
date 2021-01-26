// src/Modules/Circuits/CircuitLocation.ts
import Container, { Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { Community } from '../Communities/Community';
import { CircuitLocation as IPAMCircuitLocation } from '../IPAM/IPAMConfig.gen';

@Service()
export class CircuitLocation
  implements Omit<IPAMCircuitLocation, 'communuity'> {
  public id: string;

  public address: string;

  public provider: string;

  public communuityId: string;

  public get communuity(): Community {
    return Container.get(createContainerName('COMMUNITY', this.communuityId));
  }

  public constructor(options: Partial<CircuitLocation>) {
    Object.assign(this, options);
  }
}
