// src/Modules/CommunityContacts/CommunityContact.ts
import { Contact as IPAMContact } from '../IPAM/IPAMConfig.gen';

export class Contact implements IPAMContact {
  public id: string;

  public name: string;

  public constructor(options: Partial<Contact>) {
    Object.assign(this, options);
  }
}
