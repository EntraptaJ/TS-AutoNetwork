// src/Modules/Circuits/Circuit.ts
import Container, { Service } from 'typedi';
import {
  Circuit as IPAMCircuit,
  CircuitSide as IPAMCircuitSide,
} from '../IPAM/IPAMConfig.gen';

@Service()
export class Circuit implements IPAMCircuit {
  public id: string;

  public sideA: IPAMCircuitSide;

  public sideZ: IPAMCircuitSide;

  public get sideACircuitLocation(): Circuit {
    return Container.get(`circuitLocation-${this.sideA.id}`);
  }

  public get sideZCircuitLocation(): Circuit {
    return Container.get(`circuitLocation-${this.sideZ.id}`);
  }

  public constructor(options: Partial<Circuit>) {
    Object.assign(this, options);
  }
}
