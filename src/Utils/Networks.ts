// src/Utils/Networks.ts
import { Network } from '../Modules/Networks/Network';

/**
 * Returns the smallest child subnet of an array of networks, intended to be used
 * on an array containing a tree to retrieve the intended subnet
 * @param networks Array of networks. Intended to be an array of networks within a "tree"
 *
 * @returns The Network with the smallest subnet size
 */
export function getSmallestSubnet(networks: Network[]): Network {
  return networks.reduce((previous, current) =>
    current.IPv4.subnetMask >= previous.IPv4.subnetMask ? current : previous,
  );
}
