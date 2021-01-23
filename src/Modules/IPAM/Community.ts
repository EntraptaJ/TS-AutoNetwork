// src/Modules/Communities/Community.ts
import Container, { Service, Token } from 'typedi';
import { createContainerName } from '../../Utils/Containers';
import { CommunitySite } from '../Communities/CommunitySite';
import { Contact } from '../CommunityContacts/CommunityContact';

export const CommunitiesToken = new Token<string>('communities');

@Service()
export class Community {
  public name: string;

  public contactId: string;

  public sites: CommunitySite[];

  public get contact(): Contact {
    return Container.get(createContainerName('CONTACT', this.contactId));
  }

  public constructor(options: Partial<Community>) {
    Object.assign(this, options);
  }
}
