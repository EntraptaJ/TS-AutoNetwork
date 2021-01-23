// src/Modules/Networks/Network.ts
import Container, { Service } from 'typedi';
import { Circuit } from '../Circuits/Circuit';
import { Network as IPAMNetwork } from '../IPAM/IPAMConfig.gen';
import { NetworkHost } from './NetworkHost';

@Service()
export class Network implements IPAMNetwork {
  public prefix: string;

  public description: string;

  public circuitId?: string;

  public networks?: Network[];

  public hosts: NetworkHost[];

  public get circuit(): Circuit | undefined {
    if (!this.circuitId) {
      return undefined;
    }

    return Container.get(`circuit-${this.circuitId}`);
  }

  public constructor(options: Partial<Network>) {
    Object.assign(this, options);
  }
}
