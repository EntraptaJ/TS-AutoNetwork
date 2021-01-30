// src/bin/saveSchema.ts
import Container from 'typedi';
import { IPAMController } from '../Modules/IPAM/IPAMController';

const ipamController = Container.get(IPAMController);

await ipamController.saveSchema();
