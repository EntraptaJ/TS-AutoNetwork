// src/Modules/IPAM/IPAMController.ts
import Ajv, { DefinedError, ValidateFunction } from 'ajv';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { PathLike } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { Service } from 'typedi';
import { fileURLToPath } from 'url';
import { logger, LogMode } from '../../Library/Logger';
import { IPAM } from './IPAM';
import { load } from 'js-yaml';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { ValueTypes } from '../../Utils/Types';

function isValidationErrors(
  errors: ValidationError[],
): errors is ValidationError[] {
  if ('property' in errors[0]) {
    return true;
  }

  return false;
}

interface ProcessedValidationError {
  target: ValueTypes[keyof ValueTypes];
  constraints: {
    [type: string]: string;
  };
  path: string[];
}

function processValidationErrors(
  validationErrors: ValidationError[],
  path: string[] = [],
): ProcessedValidationError {
  for (const validationError of validationErrors) {
    if (validationError.children.length > 0) {
      return processValidationErrors(validationError.children, [
        ...path,
        validationError.property,
      ]);
    }

    if (validationError.constraints && validationError.target) {
      return {
        target: validationError.target as ValueTypes[keyof ValueTypes],
        constraints: validationError.constraints,
        path,
      };
    }
  }

  throw new Error('Invalid Errors');
}

@Service()
export class IPAMController {
  public async createSchema(): Promise<ValidateFunction<IPAM>> {
    logger.log(
      LogMode.DEBUG,
      `IPAMController.createSchema() Creating JSON Schema.`,
    );

    logger.log(
      LogMode.DEBUG,
      `ConfigController.createSchema() Dynamically importing ./ConfigSchema`,
    );
    await Promise.all([import('./IPAM')]);

    const { IPAM, ...schemas } = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
    });

    const coreSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      definitions: schemas,
      $id: 'IPAM',
      ...IPAM,
    };

    const ajv = new Ajv();

    return ajv.compile(coreSchema, true);
  }

  public async saveSchema(): Promise<void> {
    const schema = await this.createSchema();

    const schemaFilePath = resolve(
      fileURLToPath(import.meta.url),
      '../../../../schemas/IPAM.json',
    );

    return writeFile(schemaFilePath, JSON.stringify(schema.schema));
  }

  public async loadIPAM(ipamPath?: PathLike): Promise<IPAM> {
    const filePath = ipamPath ?? 'IPAM.yaml';

    const ipamValidator = await this.createSchema();

    const ipamFile = await readFile(filePath);
    const ipamYAML = load(ipamFile.toString());

    if (ipamValidator(ipamYAML)) {
      try {
        const result = await transformAndValidate(IPAM, ipamYAML, {
          validator: {
            validationError: {
              target: true,
              value: true,
            },
          },
        });
        return result;
      } catch (err) {
        if (isValidationErrors(err)) {
          const validationError = processValidationErrors(err);
          const validationPath = validationError.path.join('.');

          console.log(
            `Error at ${validationPath} ${JSON.stringify(
              validationError.target,
            )}`,
            validationError.constraints,
          );

          console.log();
        }
      }
    } else {
      // The type cast is needed to allow user-defined keywords and errors
      // You can extend this type to include your error types as needed.
      for (const err of ipamValidator.errors as DefinedError[]) {
        logger.log(LogMode.ERROR, `Config.yaml error: `, err);
      }
    }

    throw new Error('Invalid config.yaml file');
  }
}
