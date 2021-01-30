/* eslint-disable @typescript-eslint/ban-types */
// src/Utils/Validator.ts
import { registerDecorator, ValidationOptions } from 'class-validator';
import Container from 'typedi';
import { createContainerName } from './Containers';
import { toTitleCase } from './Strings';
import { ContainerKeys } from './Types';

export function IsValidID<T extends keyof typeof ContainerKeys>(
  key: T,
  validationOptions?: ValidationOptions,
): (object: Object, propertyName: string) => void {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'validId',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${toTitleCase(key)} with ID ($value) does not exist!`,
        ...validationOptions,
      },
      validator: {
        validate(value: string): boolean {
          try {
            const linkedObject = Container.get(createContainerName(key, value));

            return typeof linkedObject !== 'undefined';
          } catch {
            return false;
          }
        },
      },
    });
  };
}
