// src/Modules/Communities/Community.ts
import Container, { Service, Token } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { CommunitySite } from './CommunitySite';
import { Contact } from '../Contacts/Contact';

export const CommunitiesToken = new Token<string>('communities');

@Service()
export class Community {
  public name: string;

  public id: string;

  /**
   * Unique Contact Id Reference
   */
  public contactId: string;

  public sites: CommunitySite[];

  public get contact(): Contact {
    return Container.get(createContainerName('CONTACT', this.contactId));
  }

  public constructor(options: Partial<Community>) {
    Object.assign(this, options);
  }
}
