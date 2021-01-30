// src/Modules/Networks/NetworkHostDevice.ts
import { IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({
  title: 'NetworkHostDevice',
  description: 'Community Site Device connection for a Network Host',
})
export class NetworkHostDevice {
  /**
   * TODO: Add Validation for Site IDs
   */
  @IsString()
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
