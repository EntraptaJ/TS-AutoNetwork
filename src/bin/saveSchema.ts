// src/bin/saveSchema.ts
import { IPAMController } from '../Modules/IPAM/IPAMController';

const ipamController = IPAMController.createIPAM();

await ipamController.saveSchema();
