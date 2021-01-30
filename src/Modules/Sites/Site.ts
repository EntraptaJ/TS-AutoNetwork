// src/Modules/Sites/Site.ts
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';
import { Service } from 'typedi';
import { setContainer } from '../../Utils/Containers';
import { CommunitySite as IPAMCommunitySite } from '../IPAM/IPAMConfig.gen';
import { NetworkDevice } from '../NetworkDevices/NetworkDevice';
import { SiteType } from './SiteType';

@JSONSchema({
  title: 'Site',
  description: 'Site within a community which contains devices',
  additionalProperties: false,
  required: ['id', 'name'],
})
@Service()
export class Site implements IPAMCommunitySite {
  @IsString()
  @JSONSchema({
    description:
      'Unique Site ID used for refences from other objects, generally best practice to do COMMUNITYID.SITE_TYPE',
  })
  public id: string;

  @IsString()
  @JSONSchema({
    description: 'Friendly name of the community site',
  })
  public name: string;

  @IsOptional()
  @IsString()
  @JSONSchema({
    description: 'Type of the site',
    enum: Object.values(SiteType),
  })
  public type?: SiteType;

  @ValidateNested({ each: true })
  @Transform((items: NetworkDevice[]) => {
    items.map((item) => setContainer('SITE_DEVICE', item.id, item));

    return items;
  }, {})
  @Type(() => NetworkDevice)
  public devices: NetworkDevice[];
}
