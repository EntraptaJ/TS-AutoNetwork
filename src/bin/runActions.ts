// src/bin/runActions.ts
import Container from 'typedi';
import { logger, LogMode } from '../Library/Logger';
import { IPAMController } from '../Modules/IPAM/IPAMController';

function isError(obj: Error): obj is Error {
  if ('message' in obj) {
    return true;
  }

  return false;
}

try {
  const ipamController = Container.get(IPAMController);

  const config = await ipamController.loadIPAM('IPAM-Test.yaml');
  logger.log(LogMode.INFO, `Config loaded`, config);
} catch (err) {
  if (isError(err)) {
    console.error(err.message);
  }

  process.exit(1);
}
