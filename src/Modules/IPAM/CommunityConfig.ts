// src/Modules/Communities/CommunityConfig.ts
export interface CommunityConfig {
  /**
   * Friendly Name
   */
  name: string;

  /**
   * Community ID/Keycode
   */
  id: string;
}

export interface CommunityYAMLConfig {
  communities: CommunityConfig[];
}
