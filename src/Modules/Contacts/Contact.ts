// src/Modules/CommunityContacts/CommunityContact.ts
import { JSONSchema } from 'class-validator-jsonschema';
import { Service } from 'typedi';
import { IsString } from 'class-validator';

@JSONSchema({
  title: 'Contact',
  description: 'Contact for community/site/prefix',
  additionalProperties: false,
})
@Service()
export class Contact {
  @IsString()
  public id: string;

  /**
   * TODO: Determine contact fields and finish
   */

  @IsString()
  @JSONSchema({
    description: 'Friendly contact name',
  })
  public name: string;
}
