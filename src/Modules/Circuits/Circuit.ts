// src/Modules/Circuits/Circuit.ts
import { IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Service, Container } from 'typedi';
import xbytes from 'xbytes';
import { createContainerName } from '../../Utils/Containers';
import { IsValidID } from '../../Utils/Validator';
import { Network } from '../Networks/Network';
import { CircuitLocation } from './CircuitLocation';

@JSONSchema({
  title: 'Circuit',
  description: 'Circuit connecting two sites, or what is normally an "EVC"',
  additionalProperties: false,
})
@Service()
export class Circuit {
  @IsString()
  @JSONSchema({
    description: 'Unique Circuit ID used for refences from other objects',
  })
  public id: string;

  @IsString()
  @IsValidID('CIRCUITLOCATION')
  public sideAID: string;

  @IsString()
  @IsValidID('CIRCUITLOCATION')
  public sideZID: string;

  @IsString()
  @JSONSchema({
    description: 'EVC Speed that the circuit is capable of achiving',
  })
  public speed: string;

  public get networks(): Network[] {
    const networks = Container.getMany<() => Network>(
      `circuitNetworks-${this.id}`,
    );

    return networks.map((getNetwork) => getNetwork());
  }

  public get formattedCircuitSpeed(): string {
    return this.speed.endsWith('b') || this.speed.endsWith('B')
      ? this.speed
      : `${this.speed}b`;
  }

  public parsedCircuitSpeed(): xbytes.ByteUnitObject {
    return xbytes.parse(this.formattedCircuitSpeed);
  }

  public get speedBits(): number {
    return xbytes.relative(this.parsedCircuitSpeed().convertTo('b')).parsed
      .value;
  }

  public get sideACircuitLocation(): CircuitLocation {
    return Container.get(createContainerName('CIRCUITLOCATION', this.sideAID));
  }

  public get sideZCircuitLocation(): Circuit {
    return Container.get(createContainerName('CIRCUITLOCATION', this.sideZID));
  }
}
