/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/Modules/IPAM/IPAMController.ts
import Ajv, { ValidateFunction } from 'ajv';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { PathLike } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { Inject, Service } from 'typedi';
import { fileURLToPath } from 'url';
import { logger, LogMode } from '../../Library/Logger';
import { IPAM } from './IPAM';
import { load } from 'js-yaml';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { getIDField, isIPAMType, ValueTypes } from '../../Utils/Types';
import { isValidationErrors } from '../../Utils/ValidatorErrors';
import { contextToken, createContext } from '../../Library/Context';
import type { Context } from '../../Library/Context';
interface FieldContext {
  locateField: boolean;
}

function isFieldContext(
  context: FieldContext | Record<string, boolean>,
): context is FieldContext {
  return 'locateField' in context;
}

@Service()
export class IPAMController {
  @Inject(contextToken)
  public context: Context;

  public static createIPAM(initialContext?: Context): IPAMController {
    const context = createContext(initialContext);

    return context.container.get(IPAMController);
  }

  /**
   * Create the AJV JSON Schema from `IPAM.ts` class.
   *
   * @returns Promise that resovles to the validate function for `IPAM`
   */
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

  /**
   * Load JSON Schema and save `IPAM.json` to Schemas folder.
   *
   * @returns Promise that resolves once the file has been saved.
   */
  public async saveSchema(): Promise<void> {
    const schema = await this.createSchema();

    const schemaFilePath = resolve(
      fileURLToPath(import.meta.url),
      '../../../../schemas/IPAM.json',
    );

    return writeFile(schemaFilePath, JSON.stringify(schema.schema));
  }

  /**
   * Load an `IPAM.yaml` validate the file agaisnt the JSON Schema, and run `class-validator` and `class-transformer`
   * @param ipamPath File path to IPAM File @default `IPAM.yaml`
   *
   * @returns Promise resolving to processed and validated IPAM Class.
   */
  public async loadIPAM(ipamPath?: PathLike): Promise<IPAM> {
    const filePath = ipamPath ?? 'IPAM.yaml';

    const ipamValidator = await this.createSchema();

    const ipamFile = await readFile(filePath);
    const ipamString = ipamFile.toString();

    const ipamYAML = load(ipamString);

    const errors: Set<string> = new Set();

    if (ipamValidator(ipamYAML)) {
      try {
        const transformed = plainToClass(IPAM, ipamYAML, {
          strategy: 'exposeAll',
        });

        logger.log(LogMode.DEBUG, `Stuff: `, transformed);

        await validateOrReject(transformed);

        return transformed;
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
            const target = validationError.target as ValueTypes[keyof ValueTypes];

            if (isIPAMType(target)) {
              const [idFieldName, idFieldValue] = getIDField(target);

              let regex: RegExp;
              if (validationError.contexts) {
                const contextCore = Object.values(validationError.contexts)[0];

                if (isFieldContext(contextCore)) {
                  if (contextCore?.locateField === false) {
                    regex = new RegExp(`${idFieldName}: ${idFieldValue}`);
                  }
                }
              }

              regex ??= new RegExp(
                `((?<=(?<id>(?:${idFieldName}: ${idFieldValue})\\s+))\\s+(?<${
                  validationError.property
                }>${validationError.property}: ${
                  validationError.value as string
                }))|((?<${validationError.property}Second>${
                  validationError.property
                }: ${validationError.value as string})(?=\\k<id>))`,
                `gms`,
              );

              const match = regex.exec(ipamString);

              const line = match?.input?.substr(0, match.index).match(/\n/g)
                ?.length;

              if (typeof line === 'number') {
                const [key, message] = Object.entries(
                  validationError.constraints as { [key: string]: string },
                )[0];

                errors.add(
                  `${filePath.toString()}: line ${
                    line + 1
                  }, Error - ${message} (${key})`,
                );
              }

              logger.log(LogMode.DEBUG, `loadIPAM() className: `);
            }
          }
        }
      }
    } else {
      logger.log(LogMode.WARN, `Invalid IPAM`);

      logger.log(LogMode.DEBUG, `TODO: Handle processing invalid IPAM`);
    }

    // eslint-disable-next-line no-throw-literal
    throw Array.from(errors);
  }
}
