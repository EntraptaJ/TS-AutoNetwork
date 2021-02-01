// src/Utils/Strings.test.ts
import { TestSuite } from '@k-foss/ts-estests';
import { deepStrictEqual } from 'assert';

export class StringUtilTestSuite extends TestSuite {
  public testName = 'String Util Test Suite';

  public async test(): Promise<void> {
    const { toTitleCase } = await import('./Strings');

    deepStrictEqual(
      toTitleCase('CONTACTS'),
      'Contacts',
      `toTitleCase('CONTACTS') === 'Contacts'`,
    );

    deepStrictEqual(
      toTitleCase('HELLO WORLD'),
      'Hello World',
      `toTitleCase('HELLO WORLD') === 'Hello World'`,
    );
  }
}
