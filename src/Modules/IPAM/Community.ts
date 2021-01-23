// src/Modules/Communities/Community.ts
import { Token } from 'typedi';

export const CommunitiesToken = new Token<string>('communities');

export class Community {
  public name: string;

  public constructor(options: Partial<Community>) {
    Object.assign(this, options);
  }
}
