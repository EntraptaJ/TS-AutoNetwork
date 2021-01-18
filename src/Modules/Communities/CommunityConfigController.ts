// src/Modules/Communities/CommunityConfigController.ts
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import Container, { Service } from 'typedi';
import { logger, LogMode } from '../../Library/Logger';
import { isObjectType } from '../../Utils/isTypes';
import { CommunitiesToken, Community } from './Community';
import { CommunityYAMLConfig } from './CommunityConfig';

@Service()
export class CommunityConfigController {
  /**
   * Load the configured firewalls configuration file from disk, parse the YAML and load into the class
   */
  public async loadFile(): Promise<void> {
    const communitiesConfigFilePath = 'communities.yml';

    const communitiesFile = await readFile(communitiesConfigFilePath);

    const communitiesConfigFile = load(communitiesFile.toString());

    if (
      isObjectType<CommunityYAMLConfig>(communitiesConfigFile, 'communities')
    ) {
      logger.log(
        LogMode.INFO,
        'Loaded Communities Configuration File',
        communitiesConfigFile,
      );

      const communities = communitiesConfigFile.communities.map((community) => {
        return new Community(community);
      });

      Container.set(CommunitiesToken, communities);

      return;
    }

    throw new Error('Invlaid Firewalls configuration file');
  }
}
