// src/Modules/Networks/NetworkHost.ts
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import Container, { Service } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { IsValidID } from '../../Utils/Validator';
import { Contact } from '../Contacts/Contact';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';
import { Network } from './Network';
import { NetworkHostDevice } from './NetworkHostDevice';

@JSONSchema({
  title: 'NetworkHost',
  description: 'TODO',
  additionalProperties: false,
})
@Service()
export class NetworkHost {
  @IsString()
  @JSONSchema({
    description: 'IP Address for this host entry',
  })
  public ip: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Friendly Description for the Network Host',
  })
  public description?: string;

  /**
   * TODO: Create Network Device Link Schema
   */

  @IsOptional()
  @Type(() => NetworkHostDevice)
  public device?: NetworkHostDevice;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Friendly Description for the Network Host',
  })
  public hostname?: string;

  public parentNetworkId: string;

  /**
   * TODO: Validate Contact ID to ensure it is valid
   */

  @IsOptional()
  @IsString()
  @IsValidID('CONTACT')
  @JSONSchema({
    description: 'Reference ID for Contact',
  })
  public contactId?: string;

  /**
   * Retrieve the contact from the contactId
   */
  public get contact(): Contact | undefined {
    if (!this.contactId) {
      return undefined;
    }

    return Container.get(createContainerName('CONTACT', this.contactId));
  }

  /**
   * Retrieve the Parent network from the parentNetworkId
   */
  public get parentNetwork(): Network {
    return Container.get(createContainerName('NETWORK', this.parentNetworkId));
  }

  public get coreDevice(): NetworkDevice | undefined {
    if (this.device?.id) {
      return Container.get(createContainerName('SITE_DEVICE', this.device.id));
    }
  }
}
