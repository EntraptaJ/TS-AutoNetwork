// src/Modules/IPAM/IPAM.ts

import { Service } from 'typedi';
import { Circuit } from '../Circuits/Circuit';
import { CircuitLocation } from '../Circuits/CircuitLocation';
import { Contact } from '../Contacts/Contact';
import { Network } from '../Networks/Network';
import { Community } from '../Communities/Community';

@Service()
export class IPAM {
  public contacts: Contact[];

  public communities: Community[];

  public circuitLocations: CircuitLocation[];

  public circuits: Circuit[];

  public networks: Network[];

  public constructor(options: Partial<IPAM>) {
    Object.assign(this, options);
  }
}
