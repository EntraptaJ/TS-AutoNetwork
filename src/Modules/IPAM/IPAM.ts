// src/Modules/IPAM/IPAM.ts
import { plainToClass, Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Container, Service } from 'typedi';
import { contextToken } from '../../Library/Context';
import { logger, LogMode } from '../../Library/Logger';
import { getManyContainer, setContainer } from '../../Utils/Containers';
import { Circuit } from '../Circuits/Circuit';
import { CircuitLocation } from '../Circuits/CircuitLocation';
import { Community } from '../Communities/Community';
import { Contact } from '../Contacts/Contact';
import { Network } from '../Networks/Network';

export function processNetworks(
  networks: Network[],
  parentNetwork?: Network,
): void[] {
  return networks.flatMap((network) => {
    if (network.circuitId) {
      Container.set({
        id: `circuitNetworks-${network.circuitId}`,
        multiple: true,
        value: network.prefix,
      });
    }

    if (parentNetwork) {
      Container.set({
        id: `networks-${parentNetwork.prefix}`,
        multiple: true,
        value: network.prefix,
      });
    }

    return setContainer('NETWORK', network.prefix, network);
  });
}

@JSONSchema({
  title: 'IPAM File',
  description: 'IPAM',
  additionalProperties: false,
})
@Service()
export class IPAM {
  @ValidateNested({ each: true })
  @Transform((items: Contact[]) => {
    logger.log(LogMode.DEBUG, `Transforming Contacts from IPAM`);

    items.map((item) =>
      setContainer(
        'CONTACT',
        item.id,
        plainToClass(Contact, item),
        Container.get(contextToken).container,
      ),
    );

    return getManyContainer('CONTACT', Container.get(contextToken).container);
  })
  @Type(() => Contact)
  public contacts: Contact[];

  @ValidateNested({ each: true, always: true })
  @Transform(
    (items: Community[]) => {
      logger.log(LogMode.DEBUG, `Transforming Communities from IPAM`);
      items.map((item) =>
        setContainer(
          'COMMUNITY',
          item.id,
          item,
          Container.get(contextToken).container,
        ),
      );

      return getManyContainer(
        'COMMUNITY',
        Container.get(contextToken).container,
      );
    },
    {
      toClassOnly: true,
    },
  )
  @Type(() => Community)
  public communities: Community[];

  @ValidateNested({ each: true })
  @Transform((items: CircuitLocation[]) => {
    logger.log(LogMode.DEBUG, `Transforming Circuit Locations from IPAM`);
    items.map((item) =>
      setContainer(
        'CIRCUITLOCATION',
        item.id,
        item,
        Container.get(contextToken).container,
      ),
    );

    return getManyContainer(
      'CIRCUITLOCATION',
      Container.get(contextToken).container,
    );
  }, {})
  @Type(() => CircuitLocation)
  public circuitLocations: CircuitLocation[];

  @ValidateNested({ each: true })
  @Transform((items: Circuit[]) => {
    logger.log(LogMode.DEBUG, `Transforming Circuits from IPAM`);
    items.map((item) =>
      setContainer(
        'CIRCUIT',
        item.id,
        item,
        Container.get(contextToken).container,
      ),
    );

    return getManyContainer('CIRCUIT', Container.get(contextToken).container);
  }, {})
  @Type(() => Circuit)
  public circuits: Circuit[];

  @ValidateNested({ each: true })
  @Transform((items: Network[]) => {
    logger.log(LogMode.DEBUG, `Transforming Networks from IPAM`);

    items.map((item) =>
      setContainer(
        'NETWORK',
        item.prefix,
        item,
        Container.get(contextToken).container,
      ),
    );

    return getManyContainer('NETWORK', Container.get(contextToken).container);
  }, {})
  @Type(() => Network)
  public networks: Network[];
}
