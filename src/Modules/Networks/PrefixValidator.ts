// src/Modules/Networks/PrefixValidator.ts
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Address4 } from 'ip-address';
import { Service, Container } from 'typedi';
import { contextToken } from '../../Library/Context';
import { createContainerName } from '../../Utils/Containers';
import { Network } from './Network';

@Service()
@ValidatorConstraint({ name: 'ValidPrefix', async: false })
export class ValidPrefix implements ValidatorConstraintInterface {
  public validate(prefix: string): boolean {
    return Address4.isValid(prefix);
  }

  public defaultMessage(): string {
    // here you can provide default error message if validation failed
    /**
     * TODO: Setup IPv6 Support
     */
    return 'Prefix ($value) is not a valid IPv4 Prefix!';
  }
}

@ValidatorConstraint({ name: 'ValidSubnet', async: false })
export class ValidSubnet implements ValidatorConstraintInterface {
  public validate(prefix: string, args: ValidationArguments): boolean {
    try {
      return (
        (args.object as Network | undefined)?.IPv4.isInSubnet(
          Container.get(contextToken).container.get<Network>(
            createContainerName('NETWORK', prefix),
          ).IPv4,
        ) || false
      );
    } catch {
      return false;
    }
  }

  public defaultMessage(args: ValidationArguments): string {
    args.property = 'prefix';

    // here you can provide default error message if validation failed
    /**
     * TODO: Setup IPv6 Support
     */
    return 'Prefix ($value) is not a valid parent IPv4 Prefix of this network!';
  }
}
