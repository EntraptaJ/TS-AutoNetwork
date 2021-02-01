// src/bin/runActions.ts
import 'reflect-metadata';
import { logger, LogMode } from '../Library/Logger';
import { useContainer } from 'class-validator';
import { Container } from 'typedi';

useContainer(Container, {
  fallback: true,
  fallbackOnErrors: true,
});

try {
  const [{ IPAMController }] = await Promise.all([
    import('../Modules/IPAM/IPAMController'),
  ]);
  const ipamController = IPAMController.createIPAM();

  const config = await ipamController.loadIPAM('IPAM-Test.yaml');
  logger.log(LogMode.INFO, `Config loaded`, config);
} catch (errs) {
  for (const err of errs) {
    console.error(err);
  }

  process.exit(1);
}
