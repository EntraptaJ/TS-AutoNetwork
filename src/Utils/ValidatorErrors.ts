// src/Utils/ValidationErrors.ts
import { ValidationError } from 'class-validator';

/**
 * Type Check an array testing if it's `class-validator` error objects
 * @param errors Array of `class-validator` Error objects
 *
 * @returns True if array is validation objects, false if not
 */
export function isValidationErrors(
  errors: ValidationError[] | ValidationError,
): errors is ValidationError[] {
  if (Array.isArray(errors)) {
    return errors.every((validationError) => 'property' in validationError);
  }

  return 'property' in errors;
}
