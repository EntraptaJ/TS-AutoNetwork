// src/Modules/Networks/NetworkHostDevice.ts
import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Service } from 'typedi';
import { IsValidID } from '../../Utils/Validator';

@JSONSchema({
  title: 'NetworkHostDevice',
  description: 'Community Site Device connection for a Network Host',
})
@Service()
export class NetworkHostDevice {
  @IsString()
  @IsValidID('SITEDEVICE')
  @JSONSchema({
    description: 'Reference ID for Site Device',
  })
  public id: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description:
      'Interface on the Site Device with the Host IP address configured',
  })
  public interface?: string;
}
