/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/Modules/IPAM/IPAMController.ts
import Ajv, { ValidateFunction } from 'ajv';
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
import {
  ContainerKeys,
  isContainerKey,
  TypeIDField,
  ValueTypes,
} from '../../Utils/Types';

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
  property: string;
  value: string;
}

function processValidationErrors(
  validationErrors: ValidationError[],
): ProcessedValidationError {
  for (const validationError of validationErrors) {
    if (validationError.children.length > 0) {
      return processValidationErrors(validationError.children);
    }

    if (validationError.constraints && validationError.target) {
      console.log(validationError);
      return {
        target: validationError.target as ValueTypes[keyof ValueTypes],
        constraints: validationError.constraints,
        property: validationError.property,
        value: validationError.value,
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
    const ipamString = ipamFile.toString();

    const ipamYAML = load(ipamString);

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

          const className = validationError.target.constructor.name.toUpperCase() as keyof typeof ContainerKeys;

          if (isContainerKey(className)) {
            const idField = TypeIDField[className];

            if (idField in validationError.target) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              const idValue = validationError.target[idField] as string;

              // https://regex101.com/r/Alxmka/1
              const newExpression = new RegExp(
                `((?<=(?<id>(?:${idField}: ${idValue})\\s+))\\s+(?<${validationError.property}>${validationError.property}: ${validationError.value}))|((?<${validationError.property}Second>${validationError.property}: ${validationError.value})(?=\\k<id>))`,
                `gms`,
              );

              const expression = new RegExp(
                `((?<=${idField}: ${idValue}$\\s+).*(${validationError.property}: ${validationError.value}$))|((${validationError.property}: ${validationError.value}$).*(?=^\\s+${idField}: ${idValue}$))`,
                'gms',
              );

              const array = [...ipamString.matchAll(newExpression)];

              const firstMatch = array[0];
              const line = firstMatch.input
                ?.substr(0, firstMatch.index)
                .match(/\n/g)?.length;

              // const expressionResult = expression.exec(ipamString);

              // const line = expressionResult?.input
              //   ?.substr(0, expressionResult?.index)
              //   .match(/\n/g)?.length;

              if (typeof line === 'number') {
                throw new Error(
                  `${filePath.toString()}: line ${line + 1}, Error - ${
                    validationError.constraints.validId
                  } (no-unused-vars)`,
                );
              }

              throw new Error('Error while parsing validation error');
            }
          }
        }
      }
    } else {
      console.log('HelloFucker');
    }

    throw new Error('Invalid config.yaml file');
  }
}
