// src/Modules/Circuits/Circuit.ts
import Container, { Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import {
  Circuit as IPAMCircuit,
  CircuitSide as IPAMCircuitSide,
} from '../IPAM/IPAMConfig.gen';
import xbytes from 'xbytes';
import { Network } from '../Networks/Network';
import { CircuitLocation } from './CircuitLocation';

@Service()
export class Circuit implements IPAMCircuit {
  public id: string;

  public sideA: IPAMCircuitSide;

  public sideZ: IPAMCircuitSide;

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

  public constructor(options: Partial<Circuit>) {
    Object.assign(this, options);
  }
}
