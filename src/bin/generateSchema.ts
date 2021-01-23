/* eslint-disable @typescript-eslint/explicit-function-return-type */
// src/bin/generateSchema.ts
import { ObjectSchema } from 'fluent-json-schema';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

import { saveSchemaToDisk, saveSchemaTypesToDisk } from './Schema/Utils';

const schemaJSONPath = resolve(
  fileURLToPath(import.meta.url),
  '../../../schemas',
);

const schemaName = process.argv[0];
if (!schemaName) {
  throw new Error('Schema name required.');
}

interface SchemaModule {
  [key: string]: ObjectSchema;
}

type SchemaFile = {
  importModule: () => Promise<SchemaModule>;
  outputTypes?: string;
  outputSchema?: boolean;
  schemaName: string;
};

const schemas: SchemaFile[] = [
  {
    importModule: () => import('../Modules/IPAM/IPAMConfigSchema'),
    outputTypes: '../Modules/IPAM/IPAMConfig.gen.ts',
    outputSchema: true,
    schemaName: 'IPAM',
  },
];

const selectedSchema = schemas.find(
  (schema) => schema.schemaName === schemaName,
);
if (!selectedSchema) {
  throw new Error('Invalid schema name. Schema not found');
}

const importedModule = await selectedSchema.importModule();

for (const [, exportedSchema] of Object.entries(importedModule)) {
  const jsonSchema = exportedSchema.valueOf();
  const schemaFilePath = resolve(schemaJSONPath, `${schemaName}.json`);

  const promises = [];

  if (selectedSchema.outputTypes) {
    const typePath = resolve(
      fileURLToPath(import.meta.url),
      '../',
      selectedSchema.outputTypes,
    );

    promises.push(saveSchemaTypesToDisk(jsonSchema, schemaName, typePath));
  }

  if (selectedSchema.outputSchema) {
    promises.push(saveSchemaToDisk(jsonSchema, schemaFilePath));
  }

  await Promise.all(promises);
}
