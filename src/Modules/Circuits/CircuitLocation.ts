// src/Modules/Circuits/CircuitLocation.ts
import { Service } from 'typedi';
import { CircuitLocation as IPAMCircuitLocation } from '../IPAM/IPAMConfig.gen';

@Service()
export class CircuitLocation implements IPAMCircuitLocation {
  public id: string;

  public address: string;

  public provider: string;

  public constructor(options: Partial<CircuitLocation>) {
    Object.assign(this, options);
  }
}
