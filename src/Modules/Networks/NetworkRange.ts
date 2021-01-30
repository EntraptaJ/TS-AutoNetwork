// src/Modules/Networks/NetworkRange.ts
import { IsIP, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { NetworkRangeType } from './NetworkRangeType';

@JSONSchema({
  title: 'NetworkRange',
})
export class NetworkRange {
  @IsString()
  @IsIP()
  @JSONSchema({
    description: 'Start IP of the range',
  })
  public start: string;

  @IsString()
  @IsIP()
  @JSONSchema({
    description: 'Start IP of the range',
  })
  public end: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Friendly description of the range',
  })
  public description?: string;

  @IsString()
  @JSONSchema({
    description: 'Usage/type of this range',
    enum: Object.values(NetworkRangeType),
  })
  public type: NetworkRangeType;
}
