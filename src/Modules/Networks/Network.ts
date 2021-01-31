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
import { createContainerName, setContainer } from '../../Utils/Containers';
import { Circuit } from '../Circuits/Circuit';
import { Contact } from '../Contacts/Contact';
import { NetworkHost } from './NetworkHost';
import { NetworkRange } from './NetworkRange';
import { NetworkType } from './NetworkType';
import { IsValidID } from '../../Utils/Validator';
import { ValidPrefix, ValidSubnet } from './PrefixValidator';

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
  @Validate(ValidPrefix)
  @JSONSchema({
    description: 'Network Prefix',
  })
  public prefix: string;

  public get IPv4(): Address4 {
    console.log('Creating IPv4', this.prefix);
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

  @IsOptional()
  @IsString()
  @IsValidID('CIRCUIT')
  @Transform((circuitId: string, network: Network) => {
    Container.set({
      id: `circuitNetworks-${circuitId}`,
      multiple: true,
      value: network.prefix,
    });

    return circuitId;
  })
  @JSONSchema({
    description: 'Reference Circuit ID',
  })
  public circuitId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Transform((networks: Network[], parentNetwork: Network) => {
    return networks.map((item) => {
      item.parentNetworkId = parentNetwork.prefix;

      setContainer('NETWORK', item.prefix, item);

      return Container.get(createContainerName('NETWORK', item.prefix));
    });
  })
  @Type(() => Network)
  public networks: Network[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NetworkRange)
  public ranges: NetworkRange[];

  @IsOptional()
  @Validate(ValidSubnet, {
    context: {
      locateField: false,
    },
  })
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
  @Type(() => NetworkHost)
  public hosts: NetworkHost[];

  @IsOptional()
  @IsString()
  @IsValidID('CONTACT')
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
