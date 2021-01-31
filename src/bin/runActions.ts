// src/bin/runActions.ts
import Container from 'typedi';
import { logger, LogMode } from '../Library/Logger';
import { IPAMController } from '../Modules/IPAM/IPAMController';

try {
  const ipamController = Container.get(IPAMController);

  const config = await ipamController.loadIPAM('IPAM-Test.yaml');
  logger.log(LogMode.INFO, `Config loaded`, config);
} catch (errs) {
  for (const err of errs) {
    console.error(err);
  }

  process.exit(1);
}

// setInterval(() => console.log('Fucker'), 5000);
