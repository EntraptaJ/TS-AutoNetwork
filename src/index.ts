// src/index.ts
import { timeout } from './Utils/timeout';
import { logger, LogMode } from './Library/Logger';
import Ajv, { JSONSchemaType } from 'ajv/dist/2019';

interface Country {
  name: string;
}

interface ValidData<T extends Country> {
  countries: T[];

  country?: T['name'];
}

const schema: JSONSchemaType<ValidData<Country>> = {
  type: 'object',
  $id: 'countries',
  properties: {
    values: {},
    value: {
      enum: {
        $data: '/values/#name',
      },
    },
  },
  required: ['countries'],
};

const validData: ValidData<Country> = {
  countries: [
    {
      name: 'Hello',
    },
  ],
  country: 'Hello',
};

const ajv = new Ajv({
  $data: true,
  validateSchema: true,
  validateFormats: true,
});

const validate = ajv.compile(schema);

console.log(validate(validData));

/* const jsonSchema = ajv.getSchema('countries')?.schema;
if (typeof jsonSchema !== 'undefined' && typeof jsonSchema !== 'boolean') {
  if ('$schema' in jsonSchema) {
    const schemaFileJSON = JSON.stringify(jsonSchema);

    console.log(schemaFileJSON);
  }
} */

/**
 * Logs a greeting for the name after a 1.5 second delay.
 * @param name User you are greeting
 */
async function sayHello(name = 'John'): Promise<void> {
  logger.log(LogMode.INFO, 'Waiting 1.5 seconds then saying Hi');

  await timeout(1500);

  logger.log(LogMode.INFO, `Hello ${name}!`);
}

logger.log(LogMode.INFO, `Starting TS-Core`);

await sayHello('K-FOSS');

export {};
