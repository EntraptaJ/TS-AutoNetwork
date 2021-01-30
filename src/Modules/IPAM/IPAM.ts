// src/Modules/IPAM/IPAM.ts
import Container from 'typedi';
import { Circuit } from '../Circuits/Circuit';
import { CircuitLocation } from '../Circuits/CircuitLocation';
import { Contact } from '../Contacts/Contact';
import { Network } from '../Networks/Network';
import { Community } from '../Communities/Community';
import { JSONSchema } from 'class-validator-jsonschema';
import { ValidateNested } from 'class-validator';
import { plainToClass, Transform, Type } from 'class-transformer';
import { getManyContainer, setContainer } from '../../Utils/Containers';

export function processNetworks(
  networks: Network[],
  parentNetwork?: Network,
): Network[] {
  return networks.flatMap((network) => {
    if (network.circuitId) {
      Container.set({
        id: `circuitNetworks-${network.circuitId}`,
        multiple: true,
        value: network.prefix,
      });
    }

    const subNetworks = network.networks
      ? processNetworks(network.networks, network)
      : [];

    if (parentNetwork) {
      Container.set({
        id: `networks-${parentNetwork.prefix}`,
        multiple: true,
        value: network.prefix,
      });
    }

    setContainer('NETWORK', network.prefix, network);

    return [network, ...subNetworks];
  });
}

@JSONSchema({
  title: 'IPAM File',
  description: 'IPAM',
  additionalProperties: false,
})
export class IPAM {
  @ValidateNested({ each: true })
  @Transform((items: Contact[]) => {
    items.map((item) =>
      setContainer('CONTACT', item.id, plainToClass(Contact, item)),
    );

    return getManyContainer('CONTACT');
  }, {})
  @Type(() => Contact)
  public contacts: Contact[];

  @ValidateNested({ each: true, always: true })
  @Transform(
    (items: Community[]) => {
      items.map((item) => setContainer('COMMUNITY', item.id, item));

      return getManyContainer('COMMUNITY');
    },
    {
      toClassOnly: true,
    },
  )
  @Type(() => Community)
  public communities: Community[];

  @ValidateNested({ each: true })
  @Transform((items: CircuitLocation[]) => {
    items.map((item) => setContainer('CIRCUIT_LOCATION', item.id, item));

    return getManyContainer('CIRCUIT_LOCATION');
  }, {})
  @Type(() => CircuitLocation)
  public circuitLocations: CircuitLocation[];

  @ValidateNested({ each: true })
  @Transform((items: Circuit[]) => {
    items.map((item) => setContainer('CIRCUIT', item.id, item));

    return getManyContainer('CIRCUIT');
  }, {})
  @Type(() => Circuit)
  public circuits: Circuit[];

  @ValidateNested({ each: true })
  @Transform((items: Network[]) => {
    return processNetworks(items);
  }, {})
  @Type(() => Network)
  public networks: Network[];
}
