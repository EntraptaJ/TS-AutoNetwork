// src/Modules/Circuits/CircuitLocation.ts
import { IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import Container, { Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { Community } from '../Communities/Community';
import { CommunityCircuitSpeed } from '../CommunityCircuits/CommunityCircuitSpeed';
import { CircuitLocation as IPAMCircuitLocation } from '../IPAM/IPAMConfig.gen';

@JSONSchema({
  title: 'Circuit Location',
  description:
    'Circuit location, or what circuit providers think of as "circuits"',
  additionalProperties: false,
})
@Service()
export class CircuitLocation
  implements Omit<IPAMCircuitLocation, 'communuity'> {
  @IsString()
  @JSONSchema({
    description:
      'Unique Circuit Location ID used for refences from other objects',
  })
  public id: string;

  @IsString()
  @JSONSchema({
    description:
      'Location of the circuit demarc/termination provided to the Circuit Provider',
  })
  public address: string;

  @IsString()
  @JSONSchema({
    description: 'Name of the circuit provider',
  })
  public provider: string;

  @IsString()
  @JSONSchema({
    description: 'Reference ID of the Community the circuit is within',
  })
  public communuityId: string;

  @IsString()
  @JSONSchema({
    description: 'Demarc Port speed',
    enum: Object.values(CommunityCircuitSpeed),
  })
  public demarcSpeed: CommunityCircuitSpeed;

  public get communuity(): Community {
    return Container.get(createContainerName('COMMUNITY', this.communuityId));
  }
}
