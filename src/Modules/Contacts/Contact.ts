// src/Modules/CommunityContacts/CommunityContact.ts
import { Service } from 'typedi';
import { Contact as IPAMContact } from '../IPAM/IPAMConfig.gen';

@Service()
export class Contact implements IPAMContact {
  public id: string;

  public name: string;

  public constructor(options: Partial<Contact>) {
    Object.assign(this, options);
  }
}
