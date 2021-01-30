// src/Modules/Contacts/ContactIdValidator.ts

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import Container from 'typedi';
import { createContainerName } from '../../Utils/Containers';

@ValidatorConstraint({ name: 'contactId', async: false })
export class ValidContactID implements ValidatorConstraintInterface {
  public validate(text: string): boolean {
    try {
      const contact = Container.get(createContainerName('CONTACT', text));

      return typeof contact !== 'undefined';
    } catch {
      return false;
    }
  }

  public defaultMessage(): string {
    // here you can provide default error message if validation failed
    return 'Invalid Contact with ID ($value) does not exist!';
  }
}
