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
import { ContainerKeys, isContainerKey, TypeIDField } from '../../Utils/Types';

function isValidationErrors(
  errors: ValidationError[],
): errors is ValidationError[] {
  if ('property' in errors[0]) {
    return true;
  }

  return false;
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

  public async loadIPAM(ipamPath?: PathLike): Promise<IPAM | string[]> {
    const filePath = ipamPath ?? 'IPAM.yaml';

    const ipamValidator = await this.createSchema();

    const ipamFile = await readFile(filePath);
    const ipamString = ipamFile.toString();

    const ipamYAML = load(ipamString);

    const errors: Set<string> = new Set();

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
      } catch (errs) {
        logger.log(LogMode.DEBUG, `loadIPAM() caught error: `, errs);

        if (isValidationErrors(errs)) {
          function flat(
            r: ValidationError[],
            currentValue: ValidationError,
          ): ValidationError[] {
            if (currentValue.children.length > 0) {
              return currentValue.children.reduce(flat, r);
            }

            r.push(currentValue);
            return r;
          }

          const newCoreValidationError = errs.reduce(flat, []);

          for (const validationError of newCoreValidationError) {
            if (validationError.target) {
              const className = validationError.target.constructor.name.toUpperCase() as keyof typeof ContainerKeys;

              if (isContainerKey(className)) {
                const idField = TypeIDField[className];

                logger.log(LogMode.DEBUG, `loadIPAM() idField: `, idField);

                if (idField in validationError.target) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  const idValue = validationError.target[idField] as string;

                  let regex: RegExp;
                  if (validationError.contexts) {
                    const contextCore = Object.values(
                      validationError.contexts,
                    )[0];

                    if (contextCore.locateField === false) {
                      regex = new RegExp(`${idField}: ${idValue}`);
                    }
                  }

                  regex ??= new RegExp(
                    `((?<=(?<id>(?:${idField}: ${idValue})\\s+))\\s+(?<${validationError.property}>${validationError.property}: ${validationError.value}))|((?<${validationError.property}Second>${validationError.property}: ${validationError.value})(?=\\k<id>))`,
                    `gms`,
                  );

                  const match = regex.exec(ipamString);

                  const line = match?.input?.substr(0, match.index).match(/\n/g)
                    ?.length;

                  if (typeof line === 'number') {
                    const [key, message] = Object.entries(
                      validationError.constraints,
                    )[0];

                    console.error();

                    errors.add(
                      `${filePath.toString()}: line ${
                        line + 1
                      }, Error - ${message} (${key})`,
                    );
                  }
                }
              }

              logger.log(LogMode.DEBUG, `loadIPAM() className: `, className);
            } else {
              logger.log(
                LogMode.ERROR,
                `Validation error processing IPAM: `,
                validationError,
              );
            }
          }
        }
      }
    } else {
      logger.log(LogMode.WARN, `Invalid IPAM`);

      logger.log(LogMode.DEBUG, `TODO: Handle processing invalid IPAM`);
    }

    throw errors;
  }
}
