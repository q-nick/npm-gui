/* eslint-disable unicorn/prefer-at */
/* eslint-disable new-cap */
/* eslint-disable no-duplicate-imports */
/* eslint-disable import/no-extraneous-dependencies */
import type { DataTable } from '@cucumber/cucumber';
import {
  Before,
  setDefaultTimeout,
  setWorldConstructor,
  Then,
  When,
} from '@cucumber/cucumber';
import assert from 'assert';

import type { Manager } from '../../server/types/dependency.types';
import { TestWorld } from './TestWorld';
import { getPartialArray, getPartialObject } from './utils';

setDefaultTimeout(15 * 1000);

setWorldConstructor(TestWorld);

Before(function (this: TestWorld, testCase) {
  this.testId = `${testCase.gherkinDocument.feature?.name}-${testCase.pickle.name}`;
});

When('Prepare test project', async function (this: TestWorld) {
  await this.prepareProjectDir();
});

When(
  'Add dependencies to package.json:',
  async function (this: TestWorld, data: DataTable) {
    await this.addToPackageJson({ dependencies: data.rowsHash() });
  },
);

When(
  'Use manager {string}',
  async function (this: TestWorld, manager: Manager) {
    await this.initProject(manager);
  },
);

Then('Result is not error', async function (this: TestWorld) {
  const result = this.results[this.results.length - 1];

  assert.ok(result, 'Result not found');

  assert.ok(!(result instanceof Error), JSON.stringify(result));
});

Then('Result is error', async function (this: TestWorld) {
  const result = this.results[this.results.length - 1];

  assert.ok(result, 'Result not found');

  assert.ok(result instanceof Error, JSON.stringify(result));
});

Then(
  'Result is error {string}',
  async function (this: TestWorld, errorMessage: string) {
    const result = this.results[this.results.length - 1];

    assert.ok(result, 'Result not found');

    assert.ok(result instanceof Error, result);

    assert.ok(
      result.message.match(new RegExp(errorMessage)),
      `Error message not match. received: ${result.message.toString()}`,
    );
  },
);

Then('Result is:', async function (this: TestWorld, data: DataTable) {
  const result = this.results[this.results.length - 1];

  assert.ok(result, 'Result not found');

  // properties check
  const expected = JSON.parse(data.raw().join(' '));

  // extra properties check
  assert.deepStrictEqual(
    result,
    expected,
    `Extra properties in response: ${JSON.stringify(result)}`,
  );
});

Then('Result match:', function (this: TestWorld, data: DataTable) {
  const result = this.results[this.results.length - 1];

  assert.ok(result, 'Result not found');

  // properties check
  const expected = JSON.parse(`[${data.raw().join(',')}]`);

  if (!Array.isArray(expected)) {
    throw new TypeError('expected value must be array');
  }

  // result is array
  if (Array.isArray(result)) {
    const partialResult = getPartialArray(result, expected);
    return assert.deepStrictEqual(partialResult, expected, 'Missmatch');
  }

  if (expected.length !== 1) {
    throw new TypeError('result is object only one row is allowed');
  }

  return assert.deepStrictEqual(
    getPartialObject(result, expected[0]),
    expected[0],
    'Missmatch',
  );
});
