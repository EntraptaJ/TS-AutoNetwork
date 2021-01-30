// src/Modules/Networks/Network.ts
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Address4 } from 'ip-address';
import Container, { Service } from 'typedi';
import {
  createContainerName,
  getManyContainer,
  setContainer,
} from '../../Utils/Containers';
import { Circuit } from '../Circuits/Circuit';
import { Contact } from '../Contacts/Contact';
import { NetworkHost } from './NetworkHost';
import { NetworkRange } from './NetworkRange';
import { NetworkType } from './NetworkType';
import { processNetworks } from '../IPAM/IPAM';
import { ValidContactID } from '../Contacts/ContactIdValidator';

@JSONSchema({
  title: 'Network',
  description: 'Network object',
  additionalProperties: false,
  required: ['prefix'],
})
@Service()
export class Network {
  /**
   * Network Prefix
   */

  @IsString()
  @JSONSchema({
    description: 'Network Prefix',
  })
  public prefix: string;

  public get IPv4(): Address4 {
    return new Address4(this.prefix);
  }

  /**
   * Friendly description
   */
  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Description for this network',
  })
  public description?: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Usage/type for this network',
    enum: Object.values(NetworkType),
  })
  public type: NetworkType;

  /**
   * TODO: Create validation to
   */
  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Reference Circuit ID',
  })
  public circuitId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Transform((items: Network[]) => {
    return processNetworks(items);
  }, {})
  @Type(() => Network)
  public networks: Network[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NetworkRange)
  public ranges: NetworkRange[];

  /**
   * Unique Parent Network Id
   */
  public parentNetworkId?: string;

  public get parentNetwork(): Network | undefined {
    if (this.parentNetworkId) {
      return Container.get(
        createContainerName('NETWORK', this.parentNetworkId),
      );
    }
  }

  @IsOptional()
  @ValidateNested({ each: true })
  @Transform((items: NetworkHost[]) => {
    items.map((item) => setContainer('NETWORK_HOST', item.ip, item));

    return getManyContainer('NETWORK_HOST');
  }, {})
  @Type(() => NetworkHost)
  public hosts: NetworkHost[];

  /**
   * TODO: Create validation to enusre contactId is valid
   */

  @IsOptional()
  @IsString()
  @Validate(ValidContactID)
  @JSONSchema({
    description: 'Reference Contact ID',
  })
  public contactId?: string;

  @IsOptional()
  @IsString({
    each: true,
  })
  @JSONSchema({
    description: 'Authorative name server to forward reverse DNS requests to',
  })
  public nsServers: string[];

  public get contact(): Contact | undefined {
    if (this.contactId) {
      return Container.get(createContainerName('CONTACT', this.contactId));
    }

    return this.parentNetwork?.contact;
  }

  /**
   * Circuit Object for this network
   */
  public get circuit(): Circuit | undefined {
    if (this.circuitId) {
      return Container.get(createContainerName('CIRCUIT', this.circuitId));
    }

    return this.parentNetwork?.circuit;
  }
}
