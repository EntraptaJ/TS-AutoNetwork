// src/Modules/Communities/Community.ts
import Container, { Service, Token } from 'typedi';
import { createContainerName, setContainer } from '../../Utils/Containers';
import { Site } from '../Sites/Site';
import { Contact } from '../Contacts/Contact';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsString, Validate, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ValidContactID } from '../Contacts/ContactIdValidator';

export const CommunitiesToken = new Token<string>('communities');

@JSONSchema({
  title: 'Community Object',
  description: 'Community in which service is provided.',
  additionalProperties: false,
})
@Service()
export class Community {
  @IsString()
  @JSONSchema({
    description: 'Friendly name for the community',
  })
  public name: string;

  @IsString()
  @JSONSchema({
    description: 'Unique community ID used for refences from other objects',
  })
  public id: string;

  /**
   * TODO: Setup validation to ensure community ID exists
   */
  @Validate(ValidContactID, {
    message: 'Title is too short or long!',
  })
  @IsString()
  @JSONSchema({
    description: 'Unique contact ID reference',
  })
  public contactId: string;

  @ValidateNested({ each: true })
  @Transform((items: Site[]) => {
    items.map((item) => setContainer('SITE', item.id, item));

    return items;
  }, {})
  @Type(() => Site)
  public sites: Site[];

  public get contact(): Contact {
    return Container.get(createContainerName('CONTACT', this.contactId));
  }
}
