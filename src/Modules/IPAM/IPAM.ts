// src/Modules/IPAM/IPAM.ts

import { Service } from 'typedi';
import { Contact } from '../CommunityContacts/CommunityContact';
import { Community } from './Community';

@Service()
export class IPAM {
  public contacts: Contact[];

  public communities: Community[];

  public constructor(options: Partial<IPAM>) {
    Object.assign(this, options);
  }
}
