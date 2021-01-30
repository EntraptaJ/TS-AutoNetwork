// src/Modules/Circuits/Circuit.ts
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import Container, { Service } from 'typedi';
import xbytes from 'xbytes';
import { createContainerName } from '../../Utils/Containers';
import { Circuit as IPAMCircuit } from '../IPAM/IPAMConfig.gen';
import { Network } from '../Networks/Network';
import { CircuitLocation } from './CircuitLocation';
import { CircuitSide } from './CircuitSide';

@JSONSchema({
  title: 'Circuit',
  description: 'Circuit connecting two sites, or what is normally an "EVC"',
  additionalProperties: false,
})
@Service()
export class Circuit implements IPAMCircuit {
  @IsString()
  @JSONSchema({
    description: 'Unique Circuit ID used for refences from other objects',
  })
  public id: string;

  @ValidateNested()
  @Type(() => CircuitSide)
  public sideA: CircuitSide;

  @ValidateNested()
  @Type(() => CircuitSide)
  public sideZ: CircuitSide;

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
    return Container.get(
      createContainerName('CIRCUIT_LOCATION', this.sideA.id),
    );
  }

  public get sideZCircuitLocation(): Circuit {
    return Container.get(
      createContainerName('CIRCUIT_LOCATION', this.sideZ.id),
    );
  }
}
