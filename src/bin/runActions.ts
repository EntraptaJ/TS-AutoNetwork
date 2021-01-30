// src/bin/runActions.ts
import Container from 'typedi';
import { getOctokit } from '@actions/github';
import { getInput } from '@actions/core';
import { logger, LogMode } from '../Library/Logger';
import { IPAMController } from '../Modules/IPAM/IPAMController';

const myToken = getInput('repo-token', {
  required: false,
});

let octoKit: any;

if (myToken) {
  octoKit = getOctokit(myToken);
}

try {
  const ipamController = Container.get(IPAMController);

  const config = await ipamController.loadIPAM('IPAM-Test.yaml');
  logger.log(LogMode.INFO, `Config loaded`, config);
} catch (err) {
  console.log(err.message);
}
